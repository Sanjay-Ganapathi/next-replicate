"use client";

import React, { useRef, useState } from "react";
import type { Prediction } from "replicate";
import { Heading } from "@/components/heading";
import { HeadingShell } from "@/components/shell";
import { formSchema } from "./constants";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modelOptions, amountOptions } from "./constants";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loaders";
import { PageCard } from "@/components/page-card";
import axios from "axios";

type Input = z.infer<typeof formSchema>;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<Input>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      content: "",
      model: "1",
      amount: "1",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const bottomOfPanelRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (data: Input) => {
    try {
      setImages([]);
      let resp = await axios.post("/api/qrgen", data);
      let gen_details: Prediction = resp.data;

      const _id = gen_details.id;
      let status = gen_details.status;

      console.log("id", _id);
      console.log("status", status);

      while (status !== "succeeded" && status !== "failed") {
        await sleep(1000);
        resp = await axios.get("/api/qrgen/" + _id);
        gen_details = resp.data;
        status = gen_details.status;
        console.log("status", status);
      }

      if (status === "failed") {
        console.log("failed");
        return;
      }

      console.log("succeeded");
      setImages(gen_details.output as string[]);

      form.reset();
    } catch (err: any) {
      console.log("[QR_CODE_CLIENT_ERROR]");
      console.log("error", err);
    }
  };

  return (
    <>
      <HeadingShell className="mt-10">
        <Heading
          heading="QR Code Generator"
          subHeading="Generate Stylised QR Code from Link/Text"
        />
      </HeadingShell>

      <div className="mx-6 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" mt-10 grid w-full grid-cols-12 gap-2 space-y-2 rounded-md border-2 border-blue-600 px-3 pb-6 pt-4 lg:px-6"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 mt-2 md:col-span-6">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-2 border-blue-600 px-2 focus-visible:ring-0 focus-visible:ring-transparent "
                      disabled={isLoading}
                      placeholder="Prompt: French countryside, green pastures, lush environment"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="content"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-2 border-blue-600 px-2 focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="URL / Text: https://www.google.com"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="col-span-6 ">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="truncate border-2 border-blue-600 ">
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="col-span-6 md:col-span-3">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className=" truncate border-2 border-blue-600">
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button
              variant="outline"
              type="submit"
              className="col-span-12 border-2 border-blue-600 text-[12px] font-bold uppercase tracking-wider transition-colors hover:bg-blue-500 hover:text-white md:col-span-3"
              disabled={isLoading}
            >
              Submit
            </Button>
          </form>
        </Form>

        {isLoading && <Loader className="mt-10 h-48" />}

        {images.length > 0 && (
          <div className="mt-8 grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <PageCard
                key={image}
                src={image}
                alt="QR Code"
                downloadBtn={true}
              />
            ))}
          </div>
        )}

        <div ref={bottomOfPanelRef}></div>
      </div>
    </>
  );
}
