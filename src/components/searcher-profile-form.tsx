"use client";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import {
  ProfilesContext,
  UserHousingSearchProfile,
} from "@/app/directory/layout";
import { saveUserHousingSearchProfile } from "@/lib/utils/data";
import { getUserSession } from "@/lib/utils/auth";

const formSchema = z.object({
  pref_housemate_details: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(4000, { message: "Bio cannot be more than 4000 characters." }),
  pref_housing_type: z.enum(["1", "2"], {
    required_error: "You need to select a housing type.",
  }),
  pref_move_in: z.enum(["1", "2", "3"], {
    required_error: "You need to select a move-in preference.",
  }),
  pref_housemate_count: z.enum(["1", "2", "3", "4"], {
    required_error: "You need to select a housing type.",
  }),
  link: z.string(),
  contact_phone: z.string().max(15, { message: "Phone number is too long" }),
  contact_email: z.string().max(50, { message: "Email address is too long" }),
});

function preprocessFormData(data: UserHousingSearchProfile) {
  if (!data) {
    return;
  }
  const parsed: { [key: string]: any } = {};
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === "number") {
      parsed[k] = v.toString();
    } else if (!v) {
      parsed[k] = "";
    } else {
      parsed[k] = v;
    }
  }
  return parsed;
}

export default function SearcherProfileForm({
  handleSuccess,
}: {
  handleSuccess: (success: boolean) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const context = useContext(ProfilesContext);
  const rawUserProfile = context?.userHousingSearchProfile;
  // rawUserProfile will be undefined if user is creating a new profile, rather than editing an existing one
  const userProfile = rawUserProfile
    ? formSchema.safeParse(preprocessFormData(rawUserProfile))
    : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // @ts-ignore
    defaultValues: userProfile?.data || {
      link: "",
      contact_phone: "",
      contact_email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSubmitted(true);
    const session = await getUserSession();
    if (!session) {
      handleSuccess(false);
      return;
    }

    const saveResult = await saveUserHousingSearchProfile({
      ...data,
      user_id: session.userID,
    });

    if (saveResult) {
      handleSuccess(true);
    }

    handleSuccess(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="pref_housemate_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                {/* <Input placeholder="shadcn" {...field} /> */}
                <Textarea
                  placeholder="What are you working on? What is important to you? What type of environment do you want to live in?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pref_housing_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>What type of housing do you want?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel className="font-normal">1-year lease</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Short-term stay
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pref_move_in"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>When do you want to move in?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel className="font-normal">ASAP</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {`${"<3 months"}`}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {`${"3+ months"}`}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pref_housemate_count"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                How many housemates do you want to live with?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel className="font-normal">1-2</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel className="font-normal">3-5</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                    <FormLabel className="font-normal">6-12</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                    <FormLabel className="font-normal">12+</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What&apos;s a link that best describes you?</FormLabel>
              <FormControl>
                <Input placeholder="gwern.net" {...field} />
              </FormControl>
              <FormDescription>
                Personal website, Instagram, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What&apos;s your phone number? (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="4151234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What&apos;s your email? (Optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="me@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="pref_contact_method"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                How would you like to be contacted by others?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel className="font-normal">Email</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel className="font-normal">Twitter DMs</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <Button disabled={!form.formState.isDirty || submitted} type="submit">
          {submitted ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit
        </Button>
      </form>
    </Form>
  );
}
