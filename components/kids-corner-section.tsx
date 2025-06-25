"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Send, Smile, Star } from "lucide-react"

export default function KidsCornerSection() {
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
    console.log("Kids message submitted to Boshmir Church:", formData)
    setIsSubmitted(true)

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
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center border-2 border-yellow-200">
            <CardContent className="p-8">
              <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Amazing!</h3>
              <p className="text-lg text-gray-600">
                Your message has been sent! We love hearing from our young friends.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">🌟</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Kids Corner</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hey kids! We'd love to hear from you. Send us a message and tell us what's on your heart!
          </p>
        </div>

        <Card className="max-w-2xl mx-auto border-2 border-yellow-200">
          <CardHeader className="bg-yellow-100">
            <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
              <Heart className="h-6 w-6 text-red-500" />
              Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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
                    className="w-full px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
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
                    className="w-full px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
                    placeholder="How old are you?"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="emoji" className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling?
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`text-3xl p-3 rounded-lg border-2 transition-all ${
                        formData.emoji === emoji
                          ? "border-yellow-400 bg-yellow-100 scale-110"
                          : "border-yellow-200 hover:border-yellow-300 bg-white"
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
                  className="w-full px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg resize-none"
                  placeholder="Tell us about your day, what you're thankful for, or anything you want to share!"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold py-4 text-lg rounded-lg border-2 border-yellow-300"
              >
                <Send className="h-5 w-5 mr-2" />
                Send My Message {formData.emoji}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-sm border-2 border-yellow-200">
            <Smile className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">For Parents</h3>
            <p className="text-gray-600 text-sm">
              All messages are reviewed by our children's ministry team. We love connecting with our young members!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
