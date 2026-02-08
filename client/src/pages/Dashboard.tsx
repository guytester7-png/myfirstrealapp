import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useCourses } from "@/hooks/use-courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

// Static mapping for images since we don't have real URLs in DB yet
const courseImages: Record<string, string> = {
  "Math Course": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80", // Math abstract
  "Science Course": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80", // Science lab
  "Arabic Course": "https://images.unsplash.com/photo-1555677284-6a6f971639e0?w=800&q=80", // Arabic calligraphy
};

const courseColors: Record<string, string> = {
  "Math Course": "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400",
  "Science Course": "text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400",
  "Arabic Course": "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400",
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses();

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-muted-foreground text-lg">Choose a course to start your learning journey.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses?.map((course) => (
              <Card key={course.id} className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group flex flex-col h-full">
                {/* Image Section */}
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {/* Descriptive comment for Unsplash images used in courseImages map above */}
                  <img 
                    src={courseImages[course.title] || course.imageUrl || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80"} 
                    alt={course.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className={courseColors[course.title]}>
                      {course.title.split(' ')[0]}
                    </Badge>
                    <span className="font-bold text-lg text-primary">${(course.price / 100).toFixed(2)}</span>
                  </div>
                  <CardTitle className="font-display text-2xl">{course.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <CardDescription className="text-base line-clamp-3">
                    {course.description}
                  </CardDescription>
                </CardContent>

                <CardFooter className="pt-4 border-t bg-muted/20">
                  <Button className="w-full text-base font-semibold shadow-md group-hover:shadow-primary/20 transition-all" size="lg" asChild>
                    <Link href={`/courses/${course.id}`}>
                      Enroll Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
