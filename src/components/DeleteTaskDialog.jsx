"use client"
import * as React from "react";

import { Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { useMediaQuery } from "../lib/hooks/use-media-query";
export function DeleteTasksDialog({
  tasks,
  showTrigger = true,
  onSuccess,
  open,
  onOpenChange,
  api,
  ...props
}) {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  console.log("tasks", tasks);
  async function deleteTasks({ ids }) {
    try {
      const response = await fetch(`/api/${api}/${ids}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete tasks");
      }
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  function onDelete() {
    startDeleteTransition(async () => {
      for (const task of tasks) {
        const { error } = await deleteTasks({ ids: [task.id] });
        if (error) {
          toast.error(error);
          return;
        }
      }
      onOpenChange?.(false);
      toast.success("Tasks deleted");
      window.location.reload();
      onSuccess?.();
    });
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash2 className="mr-2 size-4" aria-hidden="true" />
              Delete ({tasks.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-medium">{tasks.length}</span>
              {tasks.length === 1 ? " task" : " tasks"} from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <RotateCcw
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 size-4" aria-hidden="true" />
            Delete ({tasks.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{tasks.length}</span>
            {tasks.length === 1 ? " task" : " tasks"} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
