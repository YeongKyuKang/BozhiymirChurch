"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Send, Smile } from "lucide-react"

export default function KidsMessageForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    message: "",
    emoji: "😊",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const emojis = ["😊", "😄", "🥰", "😇", "🤗", "🌟", "❤️", "🙏"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Kids message submitted to Boshmir Church:", formData)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", age: "", message: "", emoji: "😊" })
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-lg text-gray-600">
                Your message has been sent! We love hearing from you and will read your message soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">👶✨</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Kids Corner</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hey kids! We'd love to hear from you. Send us a message, tell us about your day, or share what you're
            thankful for!
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Heart className="h-6 w-6 text-red-500" />
              Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="What's your name?"
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="3"
                    max="18"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="How old are you?"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="emoji" className="block text-sm font-medium text-gray-700 mb-2">
                  Pick Your Mood
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`text-3xl p-2 rounded-lg border-2 transition-all ${
                        formData.emoji === emoji
                          ? "border-blue-500 bg-blue-50 scale-110"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-none"
                  placeholder="Tell us about your day, what you're thankful for, or anything you want to share!"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 text-lg rounded-lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Send My Message {formData.emoji}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-sm">
            <Smile className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Parents & Guardians</h3>
            <p className="text-gray-600 text-sm">
              All messages are reviewed by our children's ministry team. We love connecting with our young members and
              may share some messages (with permission) in our community updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
