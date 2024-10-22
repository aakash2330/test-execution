"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { submissionformSchema } from "@/schema/submissionForm";
import { clearCache } from "@/actions/clearCache";
import { DialogClose } from "@radix-ui/react-dialog";
import { fr } from "@faker-js/faker";
import { useToast } from "@/hooks/use-toast";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { toast } = useToast();
  const isFiltered = table.getState().columnFilters.length > 0;

  const form = useForm<z.infer<typeof submissionformSchema>>({
    resolver: zodResolver(submissionformSchema),
    defaultValues: {
      username: "",
      websocketUrl: "",
      backendUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof submissionformSchema>) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/redis`, {
      method: "POST",
      body: JSON.stringify({ values }),
    });
    const { success, message } = await res.json();
    clearCache();
    document.getElementById("dialogClose")?.click();
    if (success) {
      toast({
        description: message,
        variant: "success",
      });
    } else {
      toast({
        description: message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Find Submissons..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <Dialog>
        <DialogTrigger
          className={cn(
            "inline-flex h-8 rounded-md px-3 text-xs items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            "border border-input bg-black shadow-sm text-white hover:text-black hover:bg-background hover:text-accent-foreground",
          )}
        >
          Send Submission
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Please make sure your endpoints are up and running before
              submission
            </DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="hkirat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="backendUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">backendEndpoint</FormLabel>
                      <FormControl>
                        <Input placeholder="https://hkirat.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="websocketUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        websocketEndpoint
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://hkirat.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </DialogHeader>
          <DialogClose hidden id="dialogClose"></DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
