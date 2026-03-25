"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { loginSchema, LoginInput } from "@/lib/validators/auth";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function LoginForm({ locale }: { locale: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth");
  const { toast } = useToast();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setIsLoading(true);
    try {
      const result = await loginAction(values);

      if (result.error) {
        toast({
          title: t("errorTitle"),
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("successTitle"),
        description: t("successMessage"),
      });
      
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description: t("genericError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">{t("emailLabel")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="admin@hotelrioyurubi.com"
                        type="email"
                        disabled={isLoading}
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-brand-green focus:ring-brand-green-100 rounded-xl transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-gray-700 font-medium">{t("passwordLabel")}</FormLabel>
                    <button
                      type="button"
                      className="text-xs text-brand-green-700 hover:text-brand-green-800 font-medium transition-colors"
                    >
                      {t("forgotPassword")}
                    </button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="••••••••"
                        type="password"
                        disabled={isLoading}
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-brand-green focus:ring-brand-green-100 rounded-xl transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-brand-green hover:bg-brand-green-700 text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("loadingButton")}
                </>
              ) : (
                t("submitButton")
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
}
