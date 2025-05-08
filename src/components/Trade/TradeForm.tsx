
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TradeFormData, MarketCategory, TradeDirection, TradeStatus } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";

const marketCategories: { value: MarketCategory; label: string }[] = [
  { value: "forex", label: "Forex" },
  { value: "stocks", label: "Stocks" },
  { value: "crypto", label: "Cryptocurrencies" },
  { value: "commodities", label: "Commodities" },
  { value: "indices", label: "Indices" },
  { value: "metals", label: "Metals" },
];

const formSchema = z.object({
  date: z.date(),
  marketCategory: z.enum(["forex", "stocks", "crypto", "commodities", "indices", "metals"]),
  symbol: z.string().min(1, { message: "Symbol is required" }),
  direction: z.enum(["buy", "sell"]),
  entryPrice: z.coerce.number().positive({ message: "Entry price must be positive" }),
  exitPrice: z.coerce.number().positive({ message: "Exit price must be positive" }).optional(),
  quantity: z.coerce.number().positive({ message: "Quantity must be positive" }),
  status: z.enum(["open", "closed"]),
  notes: z.string().optional(),
  tags: z.string().optional(),
  pnl: z.coerce.number().optional(), // New field for direct P&L input
  screenshot: z.any().optional(),
});

interface TradeFormProps {
  initialData?: Partial<TradeFormData>;
  onSubmit: (data: TradeFormData) => void;
  isEditing?: boolean;
}

const TradeForm: React.FC<TradeFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    initialData?.screenshot instanceof File
      ? URL.createObjectURL(initialData.screenshot)
      : undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialData?.date || new Date(),
      marketCategory: initialData?.marketCategory || "forex",
      symbol: initialData?.symbol || "",
      direction: initialData?.direction || "buy",
      entryPrice: initialData?.entryPrice || 0,
      exitPrice: initialData?.exitPrice || undefined,
      quantity: initialData?.quantity || 1,
      status: initialData?.status || "open",
      notes: initialData?.notes || "",
      tags: initialData?.tags ? initialData.tags.join(", ") : "",
      pnl: initialData?.pnl || undefined, // Initialize P&L if available
      screenshot: undefined,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formData: TradeFormData = {
      date: values.date,
      marketCategory: values.marketCategory,
      symbol: values.symbol,
      direction: values.direction,
      entryPrice: values.entryPrice,
      exitPrice: values.exitPrice,
      quantity: values.quantity,
      status: values.status,
      notes: values.notes || "",
      pnl: values.pnl, // Include P&L in form data
      tags: values.tags
        ? values.tags.split(",").map((tag) => tag.trim())
        : undefined,
      screenshot: values.screenshot,
    };

    onSubmit(formData);
    toast({
      title: isEditing ? "Trade Updated" : "Trade Added",
      description: `${values.symbol} trade has been ${isEditing ? "updated" : "added"} successfully.`,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("screenshot", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Trade" : "Add New Trade"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update your trade details"
            : "Enter the details of your trade"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Market Category */}
              <FormField
                control={form.control}
                name="marketCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a market category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marketCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Symbol */}
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="EUR/USD" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the trading pair or stock symbol
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Direction */}
              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buy">Buy/Long</SelectItem>
                        <SelectItem value="sell">Sell/Short</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Entry Price */}
              <FormField
                control={form.control}
                name="entryPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Exit Price */}
              <FormField
                control={form.control}
                name="exitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exit Price {form.watch("status") === "open" && "(Optional)"}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any" 
                        {...field} 
                        value={field.value || ""} 
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormDescription>Units or lot size</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* P&L Input - NEW FIELD */}
              <FormField
                control={form.control}
                name="pnl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profit/Loss</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any" 
                        placeholder="Enter profit or loss amount" 
                        {...field} 
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Directly enter your profit (+) or loss (-) amount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="trend-following, breakout" {...field} />
                  </FormControl>
                  <FormDescription>
                    Separate tags with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add your trade analysis and observations here..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Screenshot Upload */}
            <div className="space-y-2">
              <FormLabel>Screenshot (Optional)</FormLabel>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("screenshot")?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Image</span>
                </Button>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {previewUrl && (
                  <div className="relative w-20 h-20">
                    <img
                      src={previewUrl}
                      alt="Screenshot preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">
                {isEditing ? "Update Trade" : "Save Trade"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TradeForm;
