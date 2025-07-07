import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cryptoService } from "@/lib/crypto";

const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(50, "Username too long"),
});

type UserFormData = z.infer<typeof userSchema>;

export default function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      setIsGeneratingKeys(true);
      
      // Generate cryptographic keys
      const { publicKey, privateKey } = await cryptoService.generateKeyPair();
      const address = cryptoService.generateAddress();

      const userData = {
        username: data.username,
        publicKey,
        privateKey,
        address,
      };

      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User added successfully",
        description: "New user with cryptographic keys has been created.",
      });
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to add user",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGeneratingKeys(false);
    },
  });

  const onSubmit = (data: UserFormData) => {
    addUserMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-crypto-green hover:bg-green-600 text-white dark:text-white"
        >
          <Plus size={16} className="mr-1" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-crypto-gray dark:bg-crypto-gray border-crypto-blue/30 text-white dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <User className="mr-2 text-crypto-green" size={20} />
            Add New User
          </DialogTitle>
          <DialogDescription className="text-gray-400 dark:text-gray-400">
            Create a new user with automatically generated cryptographic keys and blockchain address.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200 dark:text-gray-200">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter username..."
                      className="bg-crypto-dark dark:bg-crypto-dark border-crypto-blue/30 text-white dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isGeneratingKeys && (
              <div className="bg-crypto-dark dark:bg-crypto-dark rounded-lg p-4 border border-crypto-blue/30">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-crypto-blue border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-300 dark:text-gray-300">Generating cryptographic keys...</span>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-crypto-blue hover:bg-blue-700 text-white dark:text-white"
                disabled={addUserMutation.isPending || isGeneratingKeys}
              >
                {addUserMutation.isPending || isGeneratingKeys ? "Creating..." : "Create User"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-6 bg-transparent border-crypto-blue/30 text-gray-300 dark:text-gray-300 hover:bg-crypto-blue/20"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}