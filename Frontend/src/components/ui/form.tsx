import * as React from "react";
import * as FormPrimitive from "@radix-ui/react-form";
import { cn } from "@/lib/utils";

const Form = FormPrimitive.Root;

const FormField = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof FormPrimitive.Field>) => (
  <FormPrimitive.Field className={cn("flex flex-col gap-1", className)} {...props} />
);
FormField.displayName = "FormField";

const FormLabel = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof FormPrimitive.Label>) => (
  <FormPrimitive.Label className={cn("text-sm font-medium text-gray-700", className)} {...props} />
);
FormLabel.displayName = "FormLabel";

const FormControlInput = React.forwardRef<
  React.ElementRef<"input">,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => (
  <input
    ref={ref as React.Ref<HTMLInputElement>}
    className={cn(
      "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400",
      className
    )}
    {...props}
  />
));
FormControlInput.displayName = "FormControlInput";

const FormMessage = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof FormPrimitive.Message>) => (
    <FormPrimitive.Message className={cn("text-xs text-red-500", className)} {...props} />
);
FormMessage.displayName = "FormMessage";

const FormSubmit = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof FormPrimitive.Submit>) => (
  <FormPrimitive.Submit
    className={cn(
      "mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition",
      className
    )}
    {...props}
  />
);
FormSubmit.displayName = "FormSubmit";

export { Form, FormField, FormLabel, FormControlInput, FormMessage, FormSubmit };
