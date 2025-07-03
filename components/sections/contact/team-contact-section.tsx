"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Mail,
  MessageCircle,
  Calendar,
  Users,
  Code,
  Palette,
  Rocket,
  Shield,
  Brain,
  Target,
  Clock,
  Star,
} from "lucide-react";

// Team member data
const teamMembers = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    role: "Lead Developer",
    department: "Engineering",
    avatar: "/team/sarah.jpg",
    expertise: ["React", "Node.js", "TypeScript", "AWS"],
    description:
      "Full-stack expert with 8+ years experience building scalable web applications",
    status: "available",
    responseTime: "Within 2 hours",
    languages: ["English", "Spanish"],
    timezone: "PST",
    specialties: [
      "Complex web applications",
      "API development",
      "Performance optimization",
      "Team leadership",
    ],
    availability: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Off",
      sunday: "Off",
    },
    contactMethods: [
      { type: "email", value: "sarah@monsoft.com", preferred: true },
      { type: "calendar", value: "Schedule a call", preferred: false },
      { type: "chat", value: "Direct message", preferred: false },
    ],
  },
  {
    id: "mike-chen",
    name: "Mike Chen",
    role: "UI/UX Designer",
    department: "Design",
    avatar: "/team/mike.jpg",
    expertise: ["Figma", "Design Systems", "User Research", "Prototyping"],
    description:
      "Creative designer focused on user-centered design and seamless experiences",
    status: "busy",
    responseTime: "Within 4 hours",
    languages: ["English", "Mandarin"],
    timezone: "PST",
    specialties: [
      "Mobile app design",
      "Design systems",
      "User research",
      "Brand identity",
    ],
    availability: {
      monday: "10:00 AM - 7:00 PM",
      tuesday: "10:00 AM - 7:00 PM",
      wednesday: "10:00 AM - 7:00 PM",
      thursday: "10:00 AM - 7:00 PM",
      friday: "10:00 AM - 6:00 PM",
      saturday: "Off",
      sunday: "Off",
    },
    contactMethods: [
      { type: "email", value: "mike@monsoft.com", preferred: true },
      { type: "calendar", value: "Book design consultation", preferred: true },
      { type: "chat", value: "Quick questions", preferred: false },
    ],
  },
  {
    id: "emma-williams",
    name: "Emma Williams",
    role: "Project Manager",
    department: "Operations",
    avatar: "/team/emma.jpg",
    expertise: ["Agile", "Scrum", "Project Planning", "Client Relations"],
    description:
      "Experienced PM ensuring projects deliver on time and exceed expectations",
    status: "available",
    responseTime: "Within 1 hour",
    languages: ["English", "French"],
    timezone: "EST",
    specialties: [
      "Large scale projects",
      "Cross-team coordination",
      "Risk management",
      "Client communication",
    ],
    availability: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 4:00 PM",
      saturday: "Off",
      sunday: "Off",
    },
    contactMethods: [
      { type: "calendar", value: "Project kickoff meeting", preferred: true },
      { type: "email", value: "emma@monsoft.com", preferred: true },
      { type: "chat", value: "Quick updates", preferred: false },
    ],
  },
  {
    id: "alex-rodriguez",
    name: "Alex Rodriguez",
    role: "DevOps Engineer",
    department: "Infrastructure",
    avatar: "/team/alex.jpg",
    expertise: ["Docker", "Kubernetes", "CI/CD", "Cloud Architecture"],
    description:
      "Infrastructure specialist ensuring scalable and secure deployments",
    status: "available",
    responseTime: "Within 3 hours",
    languages: ["English", "Spanish"],
    timezone: "CST",
    specialties: [
      "Cloud migration",
      "Security implementation",
      "Performance monitoring",
      "Automation",
    ],
    availability: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Emergency only",
      sunday: "Off",
    },
    contactMethods: [
      { type: "email", value: "alex@monsoft.com", preferred: true },
      { type: "chat", value: "Technical questions", preferred: true },
      {
        type: "calendar",
        value: "Infrastructure consultation",
        preferred: false,
      },
    ],
  },
];

// Status configuration
const statusConfig = {
  available: {
    color: "bg-green-500",
    text: "Available",
    description: "Ready to help with your project",
  },
  busy: {
    color: "bg-yellow-500",
    text: "Busy",
    description: "In meetings, but will respond soon",
  },
  offline: {
    color: "bg-gray-400",
    text: "Offline",
    description: "Outside business hours",
  },
};

// Department icons
const departmentIcons = {
  Engineering: Code,
  Design: Palette,
  Operations: Target,
  Infrastructure: Shield,
};

// Contact method icons
const contactIcons = {
  email: Mail,
  calendar: Calendar,
  chat: MessageCircle,
};

export function TeamContactSection() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  const departments = Array.from(
    new Set(teamMembers.map((member) => member.department))
  );
  const filteredMembers =
    filterDepartment === "all"
      ? teamMembers
      : teamMembers.filter((member) => member.department === filterDepartment);

  const handleContactMethod = (
    member: (typeof teamMembers)[0],
    method: (typeof teamMembers)[0]["contactMethods"][0]
  ) => {
    switch (method.type) {
      case "email":
        window.location.href = `mailto:${method.value}`;
        break;
      case "calendar":
        console.log(`Opening calendar for ${member.name}`);
        // Integrate with your calendar booking system
        break;
      case "chat":
        console.log(`Opening chat with ${member.name}`);
        // Integrate with your chat system
        break;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/5 to-background">
      <div className="container">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Meet Your Future Collaborators
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Connect With Our Expert Team
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get direct access to the specialists who will bring your project
              to life. Each team member brings unique expertise and is ready to
              discuss your specific needs.
            </p>
          </motion.div>

          {/* Department Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <Button
              variant={filterDepartment === "all" ? "default" : "outline"}
              onClick={() => setFilterDepartment("all")}
              className="rounded-full"
            >
              <Star className="w-4 h-4 mr-2" />
              All Team
            </Button>
            {departments.map((dept) => {
              const Icon =
                departmentIcons[dept as keyof typeof departmentIcons];
              return (
                <Button
                  key={dept}
                  variant={filterDepartment === dept ? "default" : "outline"}
                  onClick={() => setFilterDepartment(dept)}
                  className="rounded-full"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {dept}
                </Button>
              );
            })}
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member, index) => {
              const isSelected = selectedMember === member.id;
              const status =
                statusConfig[member.status as keyof typeof statusConfig];
              const DepartmentIcon =
                departmentIcons[
                  member.department as keyof typeof departmentIcons
                ];

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    className={`glass-card cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "ring-2 ring-primary shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() =>
                      setSelectedMember(isSelected ? null : member.id)
                    }
                  >
                    <CardHeader className="text-center pb-4">
                      {/* Avatar with status */}
                      <div className="relative mx-auto mb-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-bold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background ${status.color}`}
                        />
                      </div>

                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="flex items-center justify-center gap-2 text-sm">
                        <DepartmentIcon className="w-4 h-4" />
                        {member.role}
                      </CardDescription>

                      {/* Status Badge */}
                      <Badge variant="outline" className="mx-auto text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${status.color} mr-2`}
                        />
                        {status.text}
                      </Badge>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {member.description}
                      </p>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {member.expertise.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{member.expertise.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Response Time */}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {member.responseTime}
                      </div>

                      {/* Contact Methods */}
                      <div className="space-y-2">
                        {member.contactMethods
                          .filter((method) => method.preferred)
                          .slice(0, 2)
                          .map((method, idx) => {
                            const Icon =
                              contactIcons[
                                method.type as keyof typeof contactIcons
                              ];
                            return (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContactMethod(member, method);
                                }}
                              >
                                <Icon className="w-3 h-3 mr-2" />
                                {method.type === "email"
                                  ? "Send Email"
                                  : method.value}
                              </Button>
                            );
                          })}
                      </div>

                      {/* Expanded Details */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t space-y-3"
                        >
                          {/* Specialties */}
                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Specialties
                            </h4>
                            <div className="space-y-1">
                              {member.specialties.map((specialty) => (
                                <div
                                  key={specialty}
                                  className="text-xs text-muted-foreground flex items-center"
                                >
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                                  {specialty}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Languages & Timezone */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <h4 className="font-medium mb-1">Languages</h4>
                              <p className="text-muted-foreground">
                                {member.languages.join(", ")}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Timezone</h4>
                              <p className="text-muted-foreground">
                                {member.timezone}
                              </p>
                            </div>
                          </div>

                          {/* All Contact Methods */}
                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Contact Options
                            </h4>
                            <div className="space-y-1">
                              {member.contactMethods.map((method, idx) => {
                                const Icon =
                                  contactIcons[
                                    method.type as keyof typeof contactIcons
                                  ];
                                return (
                                  <Button
                                    key={idx}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs h-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleContactMethod(member, method);
                                    }}
                                  >
                                    <Icon className="w-3 h-3 mr-2" />
                                    {method.type === "email"
                                      ? method.value
                                      : method.value}
                                    {method.preferred && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-auto text-xs"
                                      >
                                        Preferred
                                      </Badge>
                                    )}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <Card className="glass-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Not sure who to contact?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Let us match you with the right team member based on your
                  project needs. We&apos;ll connect you with the perfect
                  specialist.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button>
                    <Brain className="w-4 h-4 mr-2" />
                    Get Matched Automatically
                  </Button>
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Schedule Team Introduction
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
