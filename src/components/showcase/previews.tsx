import * as React from "react"
import {
  ChevronRight,
  CircleAlert,
  Home,
  Key,
  LayoutGrid,
  Mail,
  Settings,
  Sparkles,
  Terminal,
  TriangleAlert,
  User,
  Users,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../registry/ui/accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../registry/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../registry/ui/alert-dialog"
import {
  Attachment,
  AttachmentContent,
  AttachmentMedia,
} from "../../../registry/ui/attachment"
import { Avatar, AvatarFallback, AvatarImage } from "../../../registry/ui/avatar"
import { Badge } from "../../../registry/ui/badge"
import { Bubble, BubbleContent } from "../../../registry/ui/bubble"
import { Button } from "../../../registry/ui/button"
import { Calendar } from "../../../registry/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../registry/ui/card"
import { Checkbox } from "../../../registry/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../registry/ui/collapsible"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../registry/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../registry/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../registry/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../registry/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyTitle } from "../../../registry/ui/empty"
import { Input } from "../../../registry/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../../../registry/ui/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../../../registry/ui/item"
import { Label } from "../../../registry/ui/label"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "../../../registry/ui/message"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../registry/ui/popover"
import { Progress } from "../../../registry/ui/progress"
import { ScrollArea, ScrollBar } from "../../../registry/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../registry/ui/select"
import { Separator } from "../../../registry/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../registry/ui/sheet"
import { Skeleton } from "../../../registry/ui/skeleton"
import { Slider } from "../../../registry/ui/slider"
import { Spinner } from "../../../registry/ui/spinner"
import { Switch } from "../../../registry/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../registry/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../registry/ui/tabs"
import { Textarea } from "../../../registry/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../registry/ui/tooltip"

import { CopyButton } from "../../../registry/custom/copy-button"
import { GlowBackdrop } from "../../../registry/custom/glow-backdrop"
import { IconWrapper } from "../../../registry/custom/icon-wrapper"
import { Kbd } from "../../../registry/custom/kbd"
import { Marker } from "../../../registry/custom/marker"
import { SearchInput } from "../../../registry/custom/search-input"
import { SparkleSpinner } from "../../../registry/custom/sparklespinner"
import { Stepper } from "../../../registry/custom/stepper"
import { TextShimmer } from "../../../registry/custom/text-shimmer"

import { ChatBubble, ChatBubbleContent } from "../../../registry/blocks/chat-bubble"
import { ChatMarker } from "../../../registry/blocks/chat-marker"
import { ChatMessageRow } from "../../../registry/blocks/chat-message-row"
import { ErrorState } from "../../../registry/blocks/error-state"
import { FeaturedCard } from "../../../registry/blocks/featured-card"
import { ModelCard } from "../../../registry/blocks/model-card"
import { ModelSelect, type ModelOption } from "../../../registry/blocks/model-select"
import {
  PageContent,
  PageHeader,
  PageLayout,
  PageSection,
} from "../../../registry/blocks/page-layout"
import { LoadingState } from "../../../registry/blocks/loading-state"
import { ThinkingDisplay } from "../../../registry/blocks/thinking-display"
import { UploadDropzone } from "../../../registry/blocks/upload-dropzone"
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarProvider,
  type NavigationGroup,
} from "../../../registry/blocks/sidebar"

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}

function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>
            A window overlaid on the primary window.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>
            A panel that slides in from the bottom.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <p className="text-muted-foreground text-sm">Drawer body content.</p>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Menu <ChevronRight className="rotate-90" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <User /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Popover content</p>
          <p className="text-muted-foreground text-xs">
            Rich content in a portal.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>
            A panel that slides in from the side.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

function CollapsibleDemo() {
  const [open, setOpen] = React.useState(true)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {open ? "Hide" : "Show"} details
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">
        <p className="text-muted-foreground text-sm">
          Collapsible panel content.
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

function SwitchDemo() {
  const [checked, setChecked] = React.useState(true)
  return (
    <div className="flex items-center gap-3">
      <Switch checked={checked} onCheckedChange={setChecked} />
      <Label>Airplane mode</Label>
    </div>
  )
}

function SliderDemo() {
  const [value, setValue] = React.useState([60])
  return (
    <div className="w-full max-w-xs">
      <Slider value={value} onValueChange={setValue} max={100} step={1} />
    </div>
  )
}

/**
 * Map of item name → preview component.
 * Items absent from this map render a tasteful placeholder in the showcase.
 * Add a component to registry.json and it shows up automatically; author a
 * preview here to replace the placeholder.
 */
export const previewComponents: Record<string, React.ComponentType> = {
  accordion: () => (
    <Accordion type="single" defaultValue="i1" className="w-full max-w-sm">
      <AccordionItem value="i1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to WAI-ARIA patterns.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="i2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. Comes with polarise tokens.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  alert: () => (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Alert>
        <Terminal />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Check your configuration.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    </div>
  ),
  "alert-dialog": AlertDialogDemo,
  attachment: () => (
    <Attachment className="w-full max-w-sm">
      <AttachmentMedia>
        <Mail className="size-4" />
      </AttachmentMedia>
      <AttachmentContent>
        <p className="text-sm font-medium">report.pdf</p>
        <p className="text-muted-foreground text-xs">2.4 MB</p>
      </AttachmentContent>
    </Attachment>
  ),
  avatar: () => (
    <Row>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>FX</AvatarFallback>
      </Avatar>
    </Row>
  ),
  badge: () => (
    <Row>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </Row>
  ),
  bubble: () => (
    <Bubble className="max-w-xs">
      <BubbleContent>
        <p className="text-sm">Hey! How can I help you today?</p>
      </BubbleContent>
    </Bubble>
  ),
  button: () => (
    <Row>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
      <Button loading>Saving</Button>
    </Row>
  ),
  calendar: () => (
    <Calendar mode="single" selected={new Date()} className="rounded-md border" />
  ),
  card: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description text.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Main content goes here.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Action</Button>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  ),
  checkbox: () => (
    <Row>
      <Checkbox defaultChecked />
      <Checkbox />
    </Row>
  ),
  collapsible: CollapsibleDemo,
  command: () => (
    <Command className="w-full max-w-sm rounded-md border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <User /> Profile
          </CommandItem>
          <CommandItem>
            <Settings /> Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  dialog: DialogDemo,
  drawer: DrawerDemo,
  "dropdown-menu": DropdownMenuDemo,
  empty: () => (
    <Empty className="w-full max-w-sm">
      <EmptyTitle>No results</EmptyTitle>
      <EmptyDescription>
        Try adjusting your search or filters.
      </EmptyDescription>
    </Empty>
  ),
  input: () => <Input placeholder="Email" type="email" className="max-w-xs" />,
  "input-group": () => (
    <InputGroup className="max-w-xs">
      <InputGroupAddon>
        <InputGroupText>
          <Mail />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="you@example.com" />
    </InputGroup>
  ),
  item: () => (
    <Item className="w-full max-w-sm">
      <ItemMedia>
        <User className="size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Alex Carter</ItemTitle>
        <ItemDescription>Product designer</ItemDescription>
      </ItemContent>
    </Item>
  ),
  label: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="demo-email">Email</Label>
      <Input id="demo-email" placeholder="you@example.com" className="max-w-xs" />
    </div>
  ),
  message: () => (
    <Message className="max-w-sm">
      <MessageAvatar>
        <Avatar>
          <AvatarFallback>FX</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <p className="text-sm">This is a chat message.</p>
      </MessageContent>
    </Message>
  ),
  popover: PopoverDemo,
  progress: () => <Progress value={62} className="max-w-xs" />,
  "scroll-area": () => (
    <ScrollArea className="bg-card max-h-40 w-full max-w-xs rounded-md border p-4">
      <div className="flex flex-col gap-2 text-sm">
        {Array.from({ length: 12 }).map((_, i) => (
          <p key={i}>Item #{i + 1}</p>
        ))}
      </div>
      <ScrollBar />
    </ScrollArea>
  ),
  select: () => (
    <Select defaultValue="apple">
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  ),
  separator: () => (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <span className="text-sm">Above</span>
      <Separator />
      <span className="text-sm">Below</span>
    </div>
  ),
  sheet: SheetDemo,
  skeleton: () => (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
  slider: SliderDemo,
  spinner: () => (
    <Row>
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </Row>
  ),
  switch: SwitchDemo,
  table: () => (
    <Table className="max-w-md">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alex</TableCell>
          <TableCell>Designer</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Sam</TableCell>
          <TableCell>Engineer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  tabs: () => (
    <Tabs defaultValue="a" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="a">Account</TabsTrigger>
        <TabsTrigger value="b">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="a" className="mt-2 text-sm">
        Account settings.
      </TabsContent>
      <TabsContent value="b" className="mt-2 text-sm">
        Password settings.
      </TabsContent>
    </Tabs>
  ),
  textarea: () => (
    <Textarea placeholder="Write a message..." className="max-w-xs" />
  ),
  tooltip: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip content</TooltipContent>
    </Tooltip>
  ),

  "glow-backdrop": () => (
    <div className="relative flex h-32 w-full max-w-sm items-center justify-center overflow-hidden rounded-md border">
      <GlowBackdrop />
      <span className="relative text-sm font-medium">Centered glow</span>
    </div>
  ),
  kbd: () => (
    <Row>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <span className="text-muted-foreground text-xs">then</span>
      <Kbd>Enter</Kbd>
    </Row>
  ),
  sparklespinner: () => (
    <Row>
      <SparkleSpinner className="size-8" />
      <SparkleSpinner className="size-6" />
    </Row>
  ),
  "text-shimmer": () => (
    <div className="flex flex-col gap-1">
      <TextShimmer>Polarise UI</TextShimmer>
    </div>
  ),
  "copy-button": () => (
    <Row>
      <CopyButton text="copied-from-showcase" />
      <CopyButton
        text="import { CopyButton } from '@/components/ui/copy-button'"
        variant="outline"
      >
        {(copied) => (copied ? "Copied!" : "Copy import")}
      </CopyButton>
    </Row>
  ),
  "icon-wrapper": () => (
    <Row>
      <IconWrapper icon={Sparkles} />
      <IconWrapper icon={Settings} />
    </Row>
  ),
  marker: () => (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Marker variant="default">Section label</Marker>
      <Marker variant="separator">Separator</Marker>
      <Marker variant="border">Border</Marker>
    </div>
  ),
  stepper: () => (
    <Stepper
      steps={[
        { id: "1", label: "Plan" },
        { id: "2", label: "Build" },
        { id: "3", label: "Ship" },
      ]}
      currentIndex={1}
    />
  ),
  "search-input": () => (
    <SearchInput
      value=""
      onChange={() => {}}
      placeholder="Search components..."
      className="max-w-xs"
    />
  ),
  "featured-card": () => (
    <FeaturedCard
      heading="New feature available"
      description="Check out the latest updates to your workspace."
      icon={Sparkles}
      iconClassName="size-20 text-primary"
      ctaLink="#"
      ctaText="Learn more"
    />
  ),
  "loading-state": () => (
    <LoadingState
      title="Don't worry, we are loading!"
      description="We are fetching your data"
      className="min-h-0 py-4"
    />
  ),
  "error-state": () => (
    <ErrorState
      title="Failed to load"
      description="Something went wrong"
      onRetry={() => {}}
      className="min-h-0 py-4"
    />
  ),
  "chat-bubble": () => (
    <Row>
      <ChatBubble variant="muted" align="end">
        <ChatBubbleContent>Hello! How can I help?</ChatBubbleContent>
      </ChatBubble>
      <ChatBubble variant="ghost" align="start">
        <ChatBubbleContent>I have a question about the API.</ChatBubbleContent>
      </ChatBubble>
    </Row>
  ),
  "chat-marker": () => (
    <Row>
      <ChatMarker icon={<Terminal className="size-3" />}>
        Today
      </ChatMarker>
    </Row>
  ),
  "chat-message-row": () => (
    <div className="w-full space-y-2">
      <ChatMessageRow
        align="end"
        avatar={{ fallback: <User className="size-3" /> }}
        header="You"
        timestamp="just now"
      >
        <ChatBubble variant="muted" align="end">
          <ChatBubbleContent>Hey there!</ChatBubbleContent>
        </ChatBubble>
      </ChatMessageRow>
      <ChatMessageRow
        align="start"
        avatar={{ fallback: <Sparkles className="size-3" /> }}
        header="Assistant"
        timestamp="1m"
      >
        <ChatBubble variant="ghost" align="start">
          <ChatBubbleContent>Hi! How can I help you today?</ChatBubbleContent>
        </ChatBubble>
      </ChatMessageRow>
    </div>
  ),
  "page-layout": () => (
    <div className="w-full rounded-lg border border-border p-3">
      <PageLayout maxWidth="none" padding="sm" className="min-h-0">
        <PageHeader title="Settings" description="Manage your preferences" />
        <PageContent spacing="sm">
          <PageSection title="Profile" description="Your account information">
            <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
              Profile settings go here
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    </div>
  ),
  "thinking-display": () => (
    <div className="w-full space-y-4">
      <ThinkingDisplay
        content="Let me analyze the user's request. They want to build a chat interface with streaming responses. I should consider the message ordering, avatar alignment, and how to handle tool call interruptions."
        isStreaming={true}
        defaultOpen={true}
        className="min-h-0"
      />
      <ThinkingDisplay
        content="I considered the message ordering, avatar alignment, and how to handle tool call interruptions. The bubble variant should map by role and the transcript should auto-scroll."
        isStreaming={false}
        defaultOpen={true}
        className="min-h-0"
      />
    </div>
  ),
  "model-card": () => (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      <ModelCard
        title="llama-3.1-405b"
        description="Meta · text-generation"
        badges={
          <>
            <Badge variant="outline" className="text-xs">MIT</Badge>
            <Badge variant="secondary" className="text-xs">405B</Badge>
          </>
        }
        metadata={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="size-4" />
              Vision
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Terminal className="size-4" />
              Tool Calling
            </Badge>
          </div>
        }
        footer={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Home className="size-3" />
            <span>2 days ago</span>
          </div>
        }
        onClick={() => {}}
      />
      <ModelCard
        title="mistral-medium"
        description="Mistral AI · text-generation"
        color="#f97316"
        badges={
          <>
            <Badge variant="outline" className="text-xs">Apache 2.0</Badge>
            <Badge variant="secondary" className="text-xs">56B</Badge>
            <Badge variant="secondary" className="text-xs">Free</Badge>
          </>
        }
        action={
          <Button variant="secondary" size="sm" className="shrink-0">
            <Terminal className="mr-2 size-4" />
            Test
          </Button>
        }
        footer={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Home className="size-3" />
            <span>1 week ago</span>
          </div>
        }
      />
    </div>
  ),
  "upload-dropzone": () => (
    <div className="w-full space-y-4">
      <UploadDropzone
        variant="prominent"
        onFiles={() => {}}
        accept="image/*"
      />
      <UploadDropzone
        variant="compact"
        onFiles={() => {}}
        accept=".md"
        multiple={false}
        label="Drag & drop a .md file, or click to select"
      />
    </div>
  ),
  "model-select": () => {
    const options: ModelOption[] = [
      {
        id: "llama-3.1-405b",
        description: "Meta · text-generation",
        license: "MIT",
        parameterCount: 405_000_000_000,
        capabilities: ["chat", "completion"],
        features: [
          { label: "Vision", icon: Sparkles },
          { label: "Tool Calling", icon: Terminal },
        ],
        pricing: { inputPer1m: 2.5, outputPer1m: 3.0, currency: "EUR" },
        externalUrl: "https://huggingface.co/meta-llama/llama-3.1-405b",
        externalLabel: "HuggingFace",
      },
      {
        id: "mistral-medium",
        description: "Mistral AI · text-generation",
        color: "#f97316",
        license: "Apache 2.0",
        parameterCount: 56_000_000_000,
        capabilities: ["chat"],
        features: [{ label: "Streaming", icon: Terminal }],
        pricing: { inputPer1m: 0, outputPer1m: 0, currency: "EUR" },
      },
      {
        id: "gemma3:latest",
        description: "Google · text-generation",
        parameterCount: 12_000_000_000,
        capabilities: ["chat"],
        features: [{ label: "Vision", icon: Sparkles }],
      },
    ]
    return (
      <div className="w-full space-y-4">
        <ModelSelect
          options={options}
          value="llama-3.1-405b"
          onValueChange={() => {}}
          showLabel
          size="md"
        />
        <ModelSelect
          options={options}
          value=""
          onValueChange={() => {}}
          size="sm"
          allowClear
          showDetails={false}
        />
      </div>
    )
  },
  sidebar: () => {
    const groups: NavigationGroup[] = [
      {
        title: "Project",
        items: [
          { name: "Dashboard", href: "/projects/1", icon: LayoutGrid },
          { name: "Agents", href: "/projects/1/agents", icon: Sparkles, badge: "3" },
          { name: "Members", href: "/projects/1/members", icon: Users },
        ],
      },
      {
        title: "Settings",
        defaultClosed: true,
        items: [
          { name: "API Keys", href: "/projects/1/api-keys", icon: Key },
          { name: "Integrations", href: "/projects/1/integrations", icon: Settings },
        ],
      },
      {
        title: "Global",
        defaultClosed: true,
        items: [
          { name: "Overview", href: "/", icon: Home, exact: true },
        ],
      },
    ]
    return (
      <div className="flex w-full gap-4">
        <SidebarProvider defaultOpen>
          <div className="relative h-80 w-64 overflow-hidden rounded-lg border border-border">
            <Sidebar className="!relative !translate-x-0 w-full">
              <SidebarHeader
                logo={
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    codarise<span className="text-muted-foreground">-ui</span>
                  </span>
                }
              />
              <ScrollArea className="min-h-0 flex-1">
                <SidebarNav groups={groups} activeHref="/projects/1/agents" />
              </ScrollArea>
              <SidebarFooter
                user={{
                  name: "Felix Höbel",
                  email: "felix@codarise.ai",
                  initials: "FH",
                  roleLabel: "Owner in Codarise",
                }}
                menuItems={[
                  { label: "Profile", href: "/settings", icon: User },
                  { label: "Billing", href: "/billing", icon: Mail },
                ]}
                onLogout={() => {}}
              />
            </Sidebar>
          </div>
        </SidebarProvider>
        <SidebarProvider defaultOpen={false}>
          <div className="relative h-80 w-16 overflow-hidden rounded-lg border border-border">
            <Sidebar className="!relative !translate-x-0 w-full">
              <SidebarHeader />
              <ScrollArea className="min-h-0 flex-1">
                <SidebarNav groups={groups} activeHref="/projects/1/agents" />
              </ScrollArea>
              <SidebarFooter
                user={{ name: "Felix Höbel", initials: "FH" }}
                onLogout={() => {}}
              />
            </Sidebar>
          </div>
        </SidebarProvider>
      </div>
    )
  },
}

/** Names of items whose preview intentionally renders nothing visible
 * (toaster, providers, type-only, etc.) — show placeholder instead. */
export const noPreviewItems = new Set([
  "sonner",
  "form",
  "chart",
  "utils",
  "model-colors",
  "polarise-theme",
  "font-inter",
  "font-ibm-plex-mono",
])
