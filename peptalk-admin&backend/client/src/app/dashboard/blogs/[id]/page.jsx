"use client";
import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import TinyEditor from "@/components/editor/Tinyeditor";
import { ImageUpload } from "@/components/editor/ImageUpload";
import { useState } from "react";
import { useEffect } from "react";

const blogSchema = z.object({
  title: z.string().min(5),
  slug: z
    .string()
    .min(5)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(10),
  content: z.any(),
  coverImage: z.string().min(1),
  status: z.enum(["draft", "published"]),
});

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: {
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
      },
      coverImage: "",
      status: "draft",
    },
  });

  const generateSlug = () => {
    const title = form.getValues("title");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    form.setValue("slug", slug, { shouldValidate: true });
  };

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmY4NTBjNzZmZDg4ZWUyZjVkN2NmYyIsImlhdCI6MTc0NDk2NjkwMSwiZXhwIjoxNzQ1MDUzMzAxfQ.csU747X9I8-JfWZfY9pmN2HzBuXfs9_8YjbsXLMNC0Q";

  const fetchBlog = async () => {
    try {
      const res = await fetch(`http://localhost:5000/blogs/${id}`, {
        headers: {
          Authorization: authToken,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch blog");

      const data = await res.json();
      setBlogData(data);
      form.reset(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to fetch blog.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const handleUploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      toast({
        title: "Image Upload Error",
        description: "Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleCoverImageUpload = (url) => {
    form.setValue("coverImage", url, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`http://localhost:5000/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update blog");
      }

      toast({ title: "Success", description: "Blog updated successfully!" });
      router.push("/dashboard/blogs");
    } catch (error) {
      toast({
        title: "Update Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/blogs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Blog</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            generateSlug();
                          }}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={handleCoverImageUpload}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TinyEditor
                          form={form}
                          onChange={field.onChange}
                          handleUploadImage={handleUploadImage}
                          initialValue={blogData?.content}
                          value={blogData?.content}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.setValue("status", "draft");
                  form.handleSubmit(onSubmit)();
                }}
                disabled={isSubmitting}
              >
                {isSubmitting && form.getValues("status") === "draft" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <EyeOff className="mr-2 h-4 w-4" />
                Save Draft
              </Button>

              <Button
                type="button"
                onClick={() => {
                  form.setValue("status", "published");
                  form.handleSubmit(onSubmit)();
                }}
                disabled={isSubmitting}
              >
                {isSubmitting && form.getValues("status") === "published" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
