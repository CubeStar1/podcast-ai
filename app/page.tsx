import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Mic2, Share2, Sparkles, Upload, Wand2 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-bold max-w-3xl mx-auto">
          Turn Any Content into AI Podcast
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          PodcastAI is the ultimate AI podcast generator. Transform PDFs, texts, and docs into 
          professional-quality podcasts effortlessly. A powerful content-to-audio solution.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/podcast">
            <Button size="lg" className="gap-2">
              Generate AI Podcast <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How to Use PodcastAI
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">1. Choose Your Input</h3>
              <p className="text-muted-foreground">
                Select a PDF, paste text, or provide a custom topic for your AI podcast.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">2. Generate AI Podcast</h3>
              <p className="text-muted-foreground">
                Let our advanced AI create a professional-quality podcast from your input.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">3. Customize and Publish</h3>
              <p className="text-muted-foreground">
                Fine-tune your AI-generated podcast and share it with your audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Features of PodcastAI
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText />}
              title="PDF to Podcast Conversion"
              description="Transform any PDF content into engaging AI podcasts with our advanced technology."
            />
            <FeatureCard 
              icon={<Sparkles />}
              title="AI Voice Customization"
              description="Choose from a variety of lifelike AI voices to narrate your podcasts."
            />
            <FeatureCard 
              icon={<Mic2 />}
              title="Multi-Speaker Support"
              description="Create dynamic podcasts with multiple AI voices for interviews and discussions."
            />
            {/* Add more feature cards as needed */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Ready to Create Your AI Podcast?
          </h2>
          <p className="text-lg text-muted-foreground">
            Start converting your content into engaging podcasts today.
          </p>
          <Link href="/podcast">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <div className="text-primary h-6 w-6">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
