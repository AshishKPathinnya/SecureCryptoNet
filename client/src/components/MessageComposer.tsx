import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cryptoService } from "@/lib/crypto";
import AddUserDialog from "@/components/AddUserDialog";
import type { User, InsertMessage } from "@shared/schema";

const messageSchema = z.object({
  toUserId: z.number().min(1, "Please select a recipient"),
  content: z.string().min(1, "Message content is required"),
  encryptionMethod: z.enum(["AES-256-GCM", "RSA-2048"]).default("AES-256-GCM"),
});

type MessageFormData = z.infer<typeof messageSchema>;

export default function MessageComposer() {
  const [encryptionProcess, setEncryptionProcess] = useState<{
    originalMessage: string;
    messageHash: string;
    encryptedMessage: string;
    isEncrypting: boolean;
  }>({
    originalMessage: "",
    messageHash: "",
    encryptedMessage: "",
    isEncrypting: false,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      toUserId: 0,
      content: "",
      encryptionMethod: "AES-256-GCM",
    },
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormData) => {
      setEncryptionProcess(prev => ({ ...prev, isEncrypting: true }));
      
      // Generate hash
      const messageHash = await cryptoService.generateHash(data.content);
      
      // Encrypt message
      const encryptionResult = await cryptoService.encryptMessage(
        data.content,
        data.encryptionMethod
      );

      // Update encryption process display
      setEncryptionProcess({
        originalMessage: data.content,
        messageHash: `0x${messageHash}`,
        encryptedMessage: encryptionResult.encryptedData,
        isEncrypting: false,
      });

      // Create message object
      const messageData: InsertMessage = {
        fromUserId: 1, // Simplified: assuming current user ID is 1
        toUserId: data.toUserId,
        content: data.content,
        encryptedContent: encryptionResult.encryptedData,
        messageHash: `0x${messageHash}`,
        encryptionMethod: data.encryptionMethod,
        blockId: null,
        status: "pending",
      };

      const response = await apiRequest("POST", "/api/messages", messageData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully",
        description: "Your encrypted message has been added to the blockchain queue.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
      setEncryptionProcess(prev => ({ ...prev, isEncrypting: false }));
    },
  });

  const handleClear = () => {
    form.reset();
    setEncryptionProcess({
      originalMessage: "",
      messageHash: "",
      encryptedMessage: "",
      isEncrypting: false,
    });
  };

  const onSubmit = (data: MessageFormData) => {
    sendMessageMutation.mutate(data);
  };

  return (
    <div className="lg:col-span-2">
      <Card className="bg-white dark:bg-crypto-gray rounded-xl border border-gray-200 dark:border-crypto-blue/20 crypto-glow">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-gray-900 dark:text-white">
            <Edit className="mr-2 text-crypto-accent" size={20} />
            Compose Encrypted Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Recipient Selection */}
              <FormField
                control={form.control}
                name="toUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">Recipient</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger className="flex-1 bg-gray-50 dark:bg-crypto-dark border-gray-300 dark:border-crypto-blue/30 text-gray-900 dark:text-white">
                            <SelectValue placeholder="Select recipient..." />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-crypto-dark border-gray-300 dark:border-crypto-blue/30">
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id.toString()} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-crypto-blue/20">
                                {user.username} ({user.address.slice(0, 6)}...{user.address.slice(-4)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <AddUserDialog />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message Input */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your message here..."
                        className="bg-gray-50 dark:bg-crypto-dark border-gray-300 dark:border-crypto-blue/30 resize-none text-gray-900 dark:text-white"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Encryption Options */}
              <FormField
                control={form.control}
                name="encryptionMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">Encryption Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="AES-256-GCM" id="aes" />
                          <Label htmlFor="aes" className="text-sm">
                            AES-256-GCM
                            <span className="text-xs text-gray-400 ml-1">(Recommended)</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="RSA-2048" id="rsa" />
                          <Label htmlFor="rsa" className="text-sm">
                            RSA-2048
                            <span className="text-xs text-gray-400 ml-1">(Legacy)</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="flex-1 bg-crypto-blue hover:bg-blue-700"
                  disabled={sendMessageMutation.isPending || encryptionProcess.isEncrypting}
                >
                  <Lock className="mr-2" size={16} />
                  {sendMessageMutation.isPending || encryptionProcess.isEncrypting ? "Encrypting..." : "Encrypt & Send"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="px-6 bg-crypto-gray border-crypto-blue/30 hover:bg-gray-600"
                >
                  <Trash2 className="mr-2" size={16} />
                  Clear
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Encryption Process Display */}
      {(encryptionProcess.originalMessage || encryptionProcess.isEncrypting) && (
        <Card className="mt-6 bg-crypto-gray border-crypto-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Lock className="mr-2 text-crypto-green" size={18} />
              Encryption Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Original Message */}
            <div className="bg-crypto-dark rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Original Message</span>
                <span className="text-xs text-gray-400">Plain Text</span>
              </div>
              <p className="text-sm text-gray-100 font-mono">
                {encryptionProcess.originalMessage}
              </p>
            </div>

            {/* Message Hash */}
            {encryptionProcess.messageHash && (
              <div className="bg-crypto-dark rounded-lg p-4 border border-crypto-green/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Message Hash (SHA-256)</span>
                  <span className="text-xs text-crypto-green">Verified</span>
                </div>
                <p className="text-sm text-crypto-green font-mono break-all">
                  {encryptionProcess.messageHash}
                </p>
              </div>
            )}

            {/* Encrypted Message */}
            {encryptionProcess.encryptedMessage && (
              <div className="bg-crypto-dark rounded-lg p-4 border border-crypto-accent/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Encrypted Message</span>
                  <span className="text-xs text-crypto-accent">
                    {form.getValues("encryptionMethod")}
                  </span>
                </div>
                <p className="text-sm text-crypto-accent font-mono break-all">
                  {encryptionProcess.encryptedMessage}
                </p>
              </div>
            )}

            {/* Loading State */}
            {encryptionProcess.isEncrypting && (
              <div className="bg-crypto-dark rounded-lg p-4 border border-crypto-blue/30">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-crypto-blue border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-300">Encrypting message...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
