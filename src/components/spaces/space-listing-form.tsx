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

const blankDefaultValues = {
  name: "",
  description: "",
  resident_count: 0,
  location: "",
  room_price_range: "",
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "The name of your space must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Your space's description must be at least 5 characters.",
  }),
  resident_count: z.coerce
    .number()
    .max(20000, {
      message: "Number of residents is too large",
    })
    .min(0, {
      message: "Number of residents is too small",
    }),

  location: z.coerce.string().min(1, {
    message: "Must select a location.",
  }),

  // location: z.preprocess(
  //   (val) => (val ? String(val) : "1"),
  //   z.string().min(1, {
  //     message: "Must select a location.",
  //   })
  // ),
  room_price_range: z.coerce.string().min(1, {
    message: "Must select a price range.",
  }),
  website_url: z.preprocess((val) => (!val ? "" : val), z.string().optional()),
  contact_phone: z.preprocess(
    (val) => (!val ? "" : val),
    z.string().optional()
  ),
  contact_email: z.preprocess(
    (val) => (!val ? "" : val),
    z.string().optional()
  ),
  // contact_email: z.preprocess(
  //   (val) => (!val ? undefined : val),
  //   z
  //     .string()
  //     .email()
  //     .optional()
  // ),
  // contact_email: z.string().email().catch(""),
  image_url: z.preprocess(
    (val) => (val === null ? "" : val),
    z.string().optional()
  ),
  // website_url: z.string().nullable().optional(),
  // image_url: z.string().nullable().optional(),
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
  const [validImageUpload, setValidImageUpload] = useState(true);
  const { userSpaceListing, pullUserSpaceListing, refreshSpaceListings } =
    useSpacesContext();
  const [submitted, setSubmitted] = useState(false);

  const parseResult = formSchema.safeParse(userSpaceListing);
  const parsedSpaceData = parseResult.success ? parseResult.data : null;
  if (!parseResult.success) {
    console.error({ parseResult });
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: parsedSpaceData ?? blankDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
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
      // if (values.image_url) {
      //   await deleteCommunityImage(userSession.userID);
      // }
      // Save current user-provided image
      const imageSaveResult = await saveCommunityImage(
        uploadImageRaw,
        userSession.userID
      );

      if (imageSaveResult.success) {
        listingData.image_url = `${
          imageSaveResult.publicURL
        }?timestamp=${Date.now()}`;
      }
    }

    const listingSaveResult = await saveUserSpaceListing(
      // Converting values back to number for DB save. They're used as string for client form manipulation.
      {
        ...listingData,
        location: Number(listingData.location) || null,
        room_price_range: Number(listingData.room_price_range),
        // website_url: listingData.website_url ?? null,
      },
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
    pullUserSpaceListing(userSession.userID);
    refreshSpaceListings();
    closeDialog();

    console.log(values);
  }

  const handleImageSelection = useCallback(async (file: File | undefined) => {
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      console.error("Failed to validate image upload");
      setValidImageUpload(false);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadImageDataURL(reader.result);
        setValidImageUpload(true);
        setUploadImageRaw(file);
      }
    };
    reader.onerror = (error) => {
      setUploadImageDataURL(null);
      setValidImageUpload(false);
      console.error(error);
    };
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
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>San Francisco</SelectLabel>
                      <SelectItem value="1">Lower Haight</SelectItem>
                      <SelectItem value="2">Hayes Valley</SelectItem>
                      <SelectItem value="3">Alamo Square</SelectItem>
                      <SelectItem value="4">Mission</SelectItem>
                      <SelectItem value="5">SoMa</SelectItem>
                      <SelectItem value="6">Pacific Heights</SelectItem>
                      <SelectItem value="7">NoPa</SelectItem>
                      <SelectItem value="8">San Francisco - Other</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>East Bay</SelectLabel>
                      <SelectItem value="9">Berkeley</SelectItem>
                      <SelectItem value="10">Oakland</SelectItem>
                      <SelectItem value="11">East Bay - Other</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Peninsula</SelectLabel>
                      <SelectItem value="12">Hillsborough</SelectItem>
                      <SelectItem value="13">Menlo Park</SelectItem>
                      <SelectItem value="14">Palo Alto</SelectItem>
                      <SelectItem value="15">Peninsula - Other</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Other</SelectLabel>
                      <SelectItem value="16">South Bay</SelectItem>
                      <SelectItem value="17">North Bay</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

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
          name="room_price_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room price</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel className="font-normal">{"< $1500"}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {"$1500 - $1999"}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {"$2000 - $2499"}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="5" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {"$2500 - $3000"}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="6" />
                    </FormControl>
                    <FormLabel className="font-normal">{"> $3000"}</FormLabel>
                  </FormItem>
                </RadioGroup>
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
                  ? "This will replace your existing image."
                  : "Upload a photo for your space."}
              </FormDescription>
            </FormItem>
          )}
        />
        {!validImageUpload ? (
          <p className="text-red-500 text-sm">
            Invalid file type. Please upload an image of type PNG or JPG/JPEG,
            under 10MB.
          </p>
        ) : null}
        {uploadImageDataURL || parsedSpaceData?.image_url ? (
          <img
            className="rounded-full w-1/3 mx-auto"
            src={uploadImageDataURL || parsedSpaceData?.image_url}
            alt="Space listing image"
          ></img>
        ) : null}

        <FormField
          control={form.control}
          name="contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact phone number (optional)</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
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
              <FormLabel>Contact email (optional)</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={
            (!form.formState.isDirty && !uploadImageRaw) ||
            submitted ||
            !validImageUpload
          }
          type="submit"
        >
          {submitted ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit
        </Button>
      </form>
    </Form>
  );
}
