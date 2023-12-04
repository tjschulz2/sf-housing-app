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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useContext, useState } from "react";
import { useSpacesContext } from "@/contexts/spaces-context";
import {
  deleteCommunityImage,
  saveCommunityImage,
  saveUserSpaceListing,
} from "@/lib/utils/data";
import { useAuthContext } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";

function validateFile(file: File | null | undefined) {
  const validTypes = ["image/jpeg", "image/png"];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return !file || (validTypes.includes(file.type) && file.size <= maxSize);
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "The name of your space must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Your space's description must be at least 5 characters.",
  }),
  resident_count: z.coerce.number().max(20000, {
    message: "Number of residents is too large",
  }),
  location: z.coerce.number().min(0, {
    message: "Please select a location",
  }),
  website_url: z.string().optional(),
  image_url: z.string().url().optional(),
  // new_image_file: z
  //   // see if can make this work?
  //   .preprocess((fileList) => fileList?.[0], z.instanceof(File))
  //   .optional()
  //   .refine((fileList) => validateFile(fileList?.[0]), {
  //     message: "File must be either JPG or PNG, and under 5mb",
  //   }),
  // new_image_file: z
  //   .instanceof(File)
  //   .optional()
  //   .refine((file) => validateFile(file), {
  //     message: "File must be either JPG or PNG, and under 5mb",
  //   }),
});

export default function SpaceListingForm({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const { userSession } = useAuthContext();
  const [uploadImageRaw, setUploadImageRaw] = useState<File | null>(null);

  const [uploadImageDataURL, setUploadImageDataURL] = useState<string | null>(
    null
  );
  const { userSpaceListing } = useSpacesContext();
  const [submitted, setSubmitted] = useState(false);

  const parseResult = formSchema.safeParse(userSpaceListing);
  const parsedSpaceData = parseResult.success ? parseResult.data : null;
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: parsedSpaceData ?? {},
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setSubmitted(true);
    let listingData = { ...values };

    if (!userSession?.userID) {
      return;
    }
    if (uploadImageRaw) {
      // User has uploaded a new image, process and update accordingly
      if (!validateFile(uploadImageRaw)) {
        // Validate the file here (e.g., file type, file size)
        // Handle file validation error
        console.error("File validation failed");
        return;
      }
      if (values.image_url) {
        // Delete existing image from storage
        await deleteCommunityImage(userSession.userID);
      }
      // Save current user-provided image
      const imageSaveResult = await saveCommunityImage(
        uploadImageRaw,
        userSession.userID
      );
      console.log(imageSaveResult);
      listingData = { ...listingData, image_url: imageSaveResult.publicURL };
    }

    const listingSaveResult = await saveUserSpaceListing(
      listingData,
      userSession.userID
    );
    if (listingSaveResult.success) {
      toast({
        title: "Successfully updated space",
      });
    } else {
      toast({
        title: "Error: failed to update space",
      });
    }
    closeDialog();

    console.log(values);
  }

  const handleImageSelection = useCallback(async (file: File | undefined) => {
    if (file) {
      // form.setValue("new_image_file", file);
      if (!validateFile(file)) {
        // form.setError("new_image_file", {
        //   type: "custom",
        //   message: "invalid YO",
        // });
      }
      setUploadImageRaw(file);
      // instead of settign raw image to state, validate file here and set image validity status to state. use this to disable button, show error, etc.
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadImageDataURL(reader.result);
        }
      };
      reader.onerror = (error) => setUploadImageDataURL(null);
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Solaris, The Embassy, Mosaic..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                If you haven&apos;t named your space, now&apos;s a great time!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Tell us about the space"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              {/* <Select onValueChange={(val) => field.onChange(Number(val))}> */}
              <Select onValueChange={(val) => field.onChange(Number(val))}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>San Francisco</SelectLabel> */}
                    <SelectItem value="1">San Francisco</SelectItem>
                    <SelectItem value="7">Lower Haight</SelectItem>
                    <SelectItem value="2">Berkeley</SelectItem>
                    <SelectItem value="3">Oakland</SelectItem>
                    <SelectItem value="4">Peninsula</SelectItem>
                    <SelectItem value="5">South Bay</SelectItem>
                    <SelectItem value="6">North Bay</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resident_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of housemates</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          // control={form.control}
          name="new_image_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image (optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...field}
                  onChange={(e) => handleImageSelection(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {parsedSpaceData?.image_url
                  ? "This will replace your existing image"
                  : "Upload a photo for your space"}
              </FormDescription>
            </FormItem>
          )}
        />
        {uploadImageDataURL || parsedSpaceData?.image_url ? (
          <img
            className="rounded-full w-1/2"
            src={uploadImageDataURL || parsedSpaceData?.image_url}
            alt="Space listing image"
          ></img>
        ) : null}
        {/* <ErrorMessage errors={["error"]} name="new_image_file" /> */}

        <Button
          disabled={(!form.formState.isDirty && !uploadImageRaw) || submitted}
          type="submit"
        >
          {submitted ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit
        </Button>
      </form>
    </Form>
  );
}
