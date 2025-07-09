// components/ministries-showcase.tsx
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, BookOpen } from "lucide-react";
import EditableText from "@/components/editable-text";
import { Database } from "@/lib/supabase"; // Database 타입 임포트

interface MinistriesShowcaseProps {
  initialContent: Record<string, any>; // initialContent prop 추가
  isEditingPage: boolean;
  onContentChange: (section: string, key: string, value: string) => void;
}

export default function MinistriesShowcase({ initialContent, isEditingPage, onContentChange }: MinistriesShowcaseProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12 leading-tight">
          <EditableText
            page="home"
            section="ministries"
            contentKey="title"
            initialValue={initialContent?.ministries?.title || "Our Ministries"}
            isEditingPage={isEditingPage}
            onContentChange={onContentChange}
            tag="span"
            className="text-3xl md:text-4xl font-extrabold leading-tight"
          />
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <EditableText
                  page="home"
                  section="ministries"
                  contentKey="ministry1_title"
                  initialValue={initialContent?.ministries?.ministry1_title || "Children's Ministry"}
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                  tag="span"
                  className="text-xl font-bold"
                />
              </h3>
              {/* 여기에 <p> 대신 <div>를 사용 */}
              <div className="text-gray-600">
                <EditableText
                  page="home"
                  section="ministries"
                  contentKey="ministry1_description"
                  initialValue={initialContent?.ministries?.ministry1_description || "Dedicated programs for children to learn and grow in faith through fun activities and biblical teachings."}
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                  tag="span"
                  className="text-gray-600"
                  isTextArea={true}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <EditableText
                  page="home"
                  section="ministries"
                  contentKey="ministry2_title"
                  initialValue={initialContent?.ministries?.ministry2_title || "Youth & Young Adults"}
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                  tag="span"
                  className="text-xl font-bold"
                />
              </h3>
              {/* 여기에 <p> 대신 <div>를 사용 */}
              <div className="text-gray-600">
                <EditableText
                  page="home"
                  section="ministries"
                  contentKey="ministry2_description"
                  initialValue={initialContent?.ministries?.ministry2_description || "Engaging events and small groups designed to empower young people in their spiritual journey and build lasting friendships."}
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                  tag="span"
                  className="text-gray-600"
                  isTextArea={true}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <BookOpen className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <EditableText
                  page="home"
                  section="ministries"
                  contentKey="ministry3_title"
                  initialValue={initialContent?.ministries?.ministry3_title || "Bible Study & Discipleship"}
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                  tag="span"
                  className="text-xl font-bold"
                />
              </h3>
              {/* 여기에 <p> 대신 <div>를 사용 */}
              <div className="text-gray-600">
                <EditableText
                  page="home"
                  section="ministries"
                  contentKey="ministry3_description"
                  initialValue={initialContent?.ministries?.ministry3_description || "Deepen your understanding of God's Word through our weekly Bible studies and discipleship programs for all ages."}
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                  tag="span"
                  className="text-gray-600"
                  isTextArea={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}