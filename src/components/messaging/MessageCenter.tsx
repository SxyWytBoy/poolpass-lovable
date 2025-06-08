
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  full_name: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  message_text: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
  recipient?: Profile;
}

interface Conversation {
  id: string;
  other_user: { id: string; full_name: string };
  last_message: string;
  unread_count: number;
  updated_at: string;
}

const MessageCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Fetch conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          conversation_id,
          sender_id,
          recipient_id,
          message_text,
          created_at,
          is_read
        `)
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get unique user IDs to fetch profiles
      const userIds = new Set<string>();
      data.forEach((message: any) => {
        userIds.add(message.sender_id);
        userIds.add(message.recipient_id);
      });

      // Fetch profiles for all users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', Array.from(userIds));

      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Group by conversation and get latest message per conversation
      const conversationMap = new Map();
      data.forEach((message: any) => {
        const otherUserId = message.sender_id === user?.id ? message.recipient_id : message.sender_id;
        const otherUser = profileMap.get(otherUserId);
        
        if (!conversationMap.has(message.conversation_id)) {
          conversationMap.set(message.conversation_id, {
            id: message.conversation_id,
            other_user: { id: otherUserId, full_name: otherUser?.full_name || 'Unknown User' },
            last_message: message.message_text,
            updated_at: message.created_at,
            unread_count: 0
          });
        }
      });

      return Array.from(conversationMap.values());
    },
    enabled: !!user,
  });

  // Fetch messages for selected conversation
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *
        `)
        .eq('conversation_id', selectedConversation)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get sender profiles
      const senderIds = [...new Set(data.map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', senderIds);

      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      return data.map(message => ({
        ...message,
        sender: profileMap.get(message.sender_id)
      }));
    },
    enabled: !!selectedConversation,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, recipientId, messageText }: {
      conversationId: string;
      recipientId: string;
      messageText: string;
    }) => {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user?.id,
          recipient_id: recipientId,
          message_text: messageText,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
      setNewMessage('');
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    sendMessageMutation.mutate({
      conversationId: selectedConversation,
      recipientId: conversation.other_user.id,
      messageText: newMessage.trim(),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{conversation.other_user.full_name}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.last_message}
                    </p>
                  </div>
                  {conversation.unread_count > 0 && (
                    <Badge variant="default" className="ml-2">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedConversation
              ? conversations.find(c => c.id === selectedConversation)?.other_user.full_name
              : 'Select a conversation'
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          {selectedConversation ? (
            <>
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {messages.map((message: Message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        <p>{message.message_text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageCenter;
