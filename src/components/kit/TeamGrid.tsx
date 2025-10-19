"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Twitter, Linkedin, User } from "lucide-react";
import { TeamMember } from "../../../types";

interface TeamGridProps {
  memberIds: string[];
  teamMembersById: Record<string, TeamMember>;
}

export function TeamGrid({ memberIds, teamMembersById }: TeamGridProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (memberIds.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
        <CardContent className="p-16 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-subtle flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-heading mb-3">No team members yet</h3>
          <p className="text-body">Add team members to showcase your team</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {memberIds.map((memberId) => {
        const member = teamMembersById[memberId];
        if (!member) return null;

        return (
          <Card key={member.id} className="group hover:shadow-elevated transition-all duration-300 border-gray-200">
            <CardContent className="p-8 text-center">
              {/* Photo or Initials */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-subtle">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-600">
                    {getInitials(member.name)}
                  </span>
                )}
              </div>

              {/* Name and Role */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {member.name}
              </h3>
              {member.role && (
                <p className="text-body mb-6">
                  {member.role}
                </p>
              )}

              {/* Contact Links */}
              <div className="flex justify-center space-x-3">
                {member.email && (
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="h-10 w-10 p-0 rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <a
                      href={`mailto:${member.email}`}
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.x_handle && (
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="h-10 w-10 p-0 rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <a
                      href={`https://x.com/${member.x_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on X`}
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.linkedin_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="h-10 w-10 p-0 rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
