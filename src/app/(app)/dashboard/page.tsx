"use client"
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/message.model'
import { User } from '@/model/user.model';
import { AcceptMessageSchema } from '@/schemas/AcceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';


const UserDashboard = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isloading, setIsloading] = useState(false);
  const [isSwitchLodaing, setIsSwitchLodaing] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message.id !== messageId));
  }

  const { data: session } = useSession();

  const { register, watch, setValue } = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const acceptMessages = watch('acceptMessages');


  const fetchAcceptingMessages = useCallback(async () => {

    setIsloading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');

      setValue('acceptMessages', response.data.isAcceptingMessages);


    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
        variant: "destructive",
      });
    } finally {
      setIsloading(false);
      setIsSwitchLodaing(false);
    }
  }, [setValue, toast]);

  //fetching all messages
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsloading(false);
      setIsSwitchLodaing(false);

      try {
        const response = await axios.get<ApiResponse>('/api/get-messages'); setMessages(response.data.messages || []);

        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages"
          });

        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsloading(false);
        setIsSwitchLodaing(false)
      }
    }
    , [setIsloading, setMessages, toast])


  //fetching the initial state from server
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptingMessages();
  }, [session, setValue, toast, fetchAcceptingMessages, fetchMessages])
  //handle switch clikck
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post('/api/accept-messages', {
        acceptingmessages: !acceptMessages,
      })
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });

    }
  }



  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLodaing}
        />
        <span className="ml-2">

          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default UserDashboard   