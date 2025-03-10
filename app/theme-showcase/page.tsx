import { Laptop, Moon, Sun, Github, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ThemedCard, ThemedCardHeader, ThemedCardTitle, ThemedCardDescription, ThemedCardContent, ThemedCardFooter } from "@/components/ui/themed-card"
import { ThemedButton, GradientButton, FloatingButton, GlassButton } from "@/components/ui/themed-button"

export default function ThemeShowcase() {
  return (
    <div className="container py-12 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Theme Showcase</h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
          Explore the professional dark and light theme styles for your application.
          Toggle between themes using the button below.
        </p>
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </header>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full">
          <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
        </div>
        
        {/* Primary Colors */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Primary</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 rounded-md bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary-foreground))]">Primary</div>
            <div className="h-16 rounded-md bg-[hsl(var(--primary)/0.5)] flex items-center justify-center text-[hsl(var(--primary-foreground))]">Primary (50%)</div>
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Secondary</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 rounded-md bg-[hsl(var(--secondary))] flex items-center justify-center text-[hsl(var(--secondary-foreground))]">Secondary</div>
            <div className="h-16 rounded-md bg-[hsl(var(--secondary)/0.5)] flex items-center justify-center text-[hsl(var(--secondary-foreground))]">Secondary (50%)</div>
          </div>
        </div>

        {/* Accent Colors */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Accent</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--accent-foreground))]">Accent</div>
            <div className="h-16 rounded-md bg-[hsl(var(--accent)/0.5)] flex items-center justify-center text-[hsl(var(--accent-foreground))]">Accent (50%)</div>
          </div>
        </div>

        {/* Status Colors */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Status Colors</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 rounded-md bg-[hsl(var(--success))] flex items-center justify-center text-[hsl(var(--success-foreground))]">Success</div>
            <div className="h-16 rounded-md bg-[hsl(var(--warning))] flex items-center justify-center text-[hsl(var(--warning-foreground))]">Warning</div>
            <div className="h-16 rounded-md bg-[hsl(var(--destructive))] flex items-center justify-center text-[hsl(var(--destructive-foreground))]">Error</div>
          </div>
        </div>

        {/* Background & Text */}
        <div className="space-y-2 col-span-2">
          <h3 className="text-lg font-medium">Background & Text</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 rounded-md bg-[hsl(var(--background))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--foreground))]">Background</div>
            <div className="h-16 rounded-md bg-[hsl(var(--muted))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">Muted</div>
            <div className="h-16 rounded-md glass-effect flex items-center justify-center">Glass Effect</div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <ThemedCard>
            <ThemedCardHeader>
              <ThemedCardTitle>Default Card</ThemedCardTitle>
              <ThemedCardDescription>This is a default card with standard styling.</ThemedCardDescription>
            </ThemedCardHeader>
            <ThemedCardContent>
              <p>Cards provide a flexible container for related content and actions.</p>
            </ThemedCardContent>
            <ThemedCardFooter>
              <ThemedButton size="sm">Learn More</ThemedButton>
            </ThemedCardFooter>
          </ThemedCard>

          <ThemedCard variant="outline">
            <ThemedCardHeader>
              <ThemedCardTitle>Outline Card</ThemedCardTitle>
              <ThemedCardDescription>This card has an outline style.</ThemedCardDescription>
            </ThemedCardHeader>
            <ThemedCardContent>
              <p>Outline cards are perfect for secondary information.</p>
            </ThemedCardContent>
            <ThemedCardFooter>
              <ThemedButton variant="outline" size="sm">Learn More</ThemedButton>
            </ThemedCardFooter>
          </ThemedCard>

          <ThemedCard variant="glass">
            <ThemedCardHeader>
              <ThemedCardTitle>Glass Card</ThemedCardTitle>
              <ThemedCardDescription>This card has a glass effect.</ThemedCardDescription>
            </ThemedCardHeader>
            <ThemedCardContent>
              <p>Glass cards create a modern, translucent look.</p>
            </ThemedCardContent>
            <ThemedCardFooter>
              <GlassButton size="sm">Learn More</GlassButton>
            </ThemedCardFooter>
          </ThemedCard>

          <ThemedCard variant="gradient">
            <ThemedCardHeader>
              <ThemedCardTitle>Gradient Card</ThemedCardTitle>
              <ThemedCardDescription>This card has a subtle gradient background.</ThemedCardDescription>
            </ThemedCardHeader>
            <ThemedCardContent>
              <p>Gradient cards add visual interest to your interface.</p>
            </ThemedCardContent>
            <ThemedCardFooter>
              <GradientButton size="sm">Learn More</GradientButton>
            </ThemedCardFooter>
          </ThemedCard>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Standard Buttons</h3>
            <div className="flex flex-col gap-2">
              <ThemedButton>Default Button</ThemedButton>
              <ThemedButton variant="secondary">Secondary Button</ThemedButton>
              <ThemedButton variant="outline">Outline Button</ThemedButton>
              <ThemedButton variant="ghost">Ghost Button</ThemedButton>
              <ThemedButton variant="link">Link Button</ThemedButton>
              <ThemedButton variant="destructive">Destructive Button</ThemedButton>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Buttons with Icons</h3>
            <div className="flex flex-col gap-2">
              <ThemedButton icon={<Sun />}>Light Mode</ThemedButton>
              <ThemedButton icon={<Moon />} iconPosition="right">Dark Mode</ThemedButton>
              <ThemedButton icon={<Laptop />} variant="secondary">System Theme</ThemedButton>
              <ThemedButton icon={<Github />} variant="outline">GitHub</ThemedButton>
              <ThemedButton icon={<Zap />} data-variant="success">Quick Action</ThemedButton>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Button Sizes</h3>
            <div className="flex flex-col gap-2">
              <ThemedButton size="lg">Large Button</ThemedButton>
              <ThemedButton>Default Button</ThemedButton>
              <ThemedButton size="sm">Small Button</ThemedButton>
              <ThemedButton size="icon" icon={<Sun />}><span className="sr-only">Icon button</span></ThemedButton>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Special Buttons</h3>
            <div className="flex flex-col gap-2">
              <GradientButton>Gradient Button</GradientButton>
              <FloatingButton>Floating Button</FloatingButton>
              <GlassButton>Glass Button</GlassButton>
              <ThemedButton data-variant="warning">Warning Button</ThemedButton>
              <ThemedButton data-variant="info">Info Button</ThemedButton>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Typography</h2>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <p className="text-[hsl(var(--muted-foreground))]">Used for main page titles</p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Heading 2</h2>
            <p className="text-[hsl(var(--muted-foreground))]">Used for section titles</p>
          </div>
          <div>
            <h3 className="text-2xl font-medium">Heading 3</h3>
            <p className="text-[hsl(var(--muted-foreground))]">Used for subsection titles</p>
          </div>
          <div>
            <h4 className="text-xl font-medium">Heading 4</h4>
            <p className="text-[hsl(var(--muted-foreground))]">Used for card titles and smaller sections</p>
          </div>
          <div>
            <p className="text-base">Body text - This is the standard paragraph text used throughout the application.</p>
          </div>
          <div>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Small text - Used for captions, hints, and secondary information.</p>
          </div>
          <div>
            <p className="gradient-text text-2xl font-bold">Gradient Text - For special emphasis and highlights.</p>
          </div>
        </div>
      </section>
    </div>
  )
} 