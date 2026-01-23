import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Separator } from "@workspace/ui/components/separator";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@workspace/ui/components/card";
import {
    Form,
    FormItem,
    FormLabel,
    FormField,
    FormMessage,
    FormControl,
    FormDescription,
} from "@workspace/ui/components/form";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { VapiFormFields } from "./vapi-form-fields";
import { widgetSettingsSchema } from "../../schemas";
import { FormSchema } from "../../types";

// Combined schema for all widget settings

type WidgetSettings = Doc<"widgetSettings">;

interface CustomizationFormProps {
    initialData?: WidgetSettings | null;
    hasVapiPlugin: boolean;
};

export const CustomizationForm = ({
    initialData,
    hasVapiPlugin,
}: CustomizationFormProps) => {
    const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);

    const form = useForm<FormSchema>({
        resolver: zodResolver(widgetSettingsSchema),
        defaultValues: {
            greetMessage:
                initialData?.greetMessage || "Hi! How can I help you today?",
            defaultSuggestions: {
                suggestion1: initialData?.defaultSuggestions.suggestion1 || "",
                suggestion2: initialData?.defaultSuggestions.suggestion2 || "",
                suggestion3: initialData?.defaultSuggestions.suggestion3 || "",
            },
            vapiSettings: {
                assistantId: initialData?.vapiSettings.assistantId || "",
                phoneNumber: initialData?.vapiSettings.phoneNumber || "",
            },
        },
    });

    const onSubmit = async (values: FormSchema) => {
        try {
            const vapiSettings: WidgetSettings["vapiSettings"] = {
                assistantId:
                    values.vapiSettings.assistantId === "None"
                        ? ""
                        : values.vapiSettings.assistantId,
                phoneNumber:
                    values.vapiSettings.phoneNumber === "None"
                        ? ""
                        : values.vapiSettings.phoneNumber,
            };

            await upsertWidgetSettings({
                greetMessage: values.greetMessage,
                defaultSuggestions: values.defaultSuggestions,
                vapiSettings,
            });

            toast.success("Widget settings saved");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        };
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>General Chat Settings</CardTitle>
                        <CardDescription>
                            Configure basic chat widget behaviour and messages
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="greetMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Greeting Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Welcome message shown when chat open"
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The first message customers see when they open the chat
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator />
                        <div className="space-y-4">
                            <div className="">
                                <h3 className="mb-4 text-sm">
                                    Default Suggestions
                                </h3>
                                <p className="mb-4 text-muted-foreground text-sm">
                                    Quick reply suggestions shown to customers to help guide the conversation
                                </p>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="defaultSuggestions.suggestion1"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Suggestion 1</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g., How do I get started?"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="defaultSuggestions.suggestion2"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Suggestion 2</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g., What are your pricing plans?"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="defaultSuggestions.suggestion3"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Suggestion 3</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g., I need help with my account"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            {hasVapiPlugin && (
                <Card>
                    <CardHeader>
                        <CardTitle>Voice Assistant Settings</CardTitle>
                        <CardDescription>
                            Configure voice calling features powered by Vapi
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <VapiFormFields form={form} />
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end">
                <Button disabled={form.formState.isSubmitting} type="submit">
                    Save Settings
                </Button>
            </div>
            </form>
        </Form>
    );
};
