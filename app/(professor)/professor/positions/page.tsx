import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, MapPin, Users, ExternalLink } from "lucide-react"
import { format } from "date-fns"

export default async function PositionsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get all grants created by this professor
  const { data: grants, error } = await supabase
    .from("grants")
    .select(
      `
      *,
      universities:university_id (
        id,
        name,
        country,
        city
      )
    `,
    )
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching grants:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Open Positions</h1>
            <p className="mt-2 text-muted-foreground">Manage your scholarship and research positions</p>
          </div>
          <Button asChild>
            <Link href="/professor/positions/new">
              <Plus className="mr-2 h-4 w-4" />
              New Position
            </Link>
          </Button>
        </div>

        {!grants || grants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                <Users className="h-full w-full" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Positions Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first position to start receiving applications from students.
              </p>
              <Button asChild>
                <Link href="/professor/positions/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Position
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {grants.map((grant: any) => {
              const university = Array.isArray(grant.universities)
                ? grant.universities[0]
                : grant.universities

              return (
                <Card key={grant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{grant.title}</CardTitle>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          {university && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {university.name}
                              {university.country && `, ${university.country}`}
                            </span>
                          )}
                          {grant.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Deadline: {format(new Date(grant.deadline), "MMM dd, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {grant.grant_type.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {grant.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {grant.degree_levels?.map((level: string) => (
                          <Badge key={level} variant="outline" className="capitalize">
                            {level}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {grant.application_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={grant.application_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              Apply
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/professor/positions/${grant.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
