"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Send, Star, Globe } from "lucide-react"

export default function UkrainianKidsSection() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    message: "",
    language: "english",
    emoji: "💙",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const emojis = ["💙", "💛", "😊", "🌻", "🕊️", "⭐", "❤️", "🙏"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Ukrainian kids message submitted:", formData)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", age: "", message: "", language: "english", emoji: "💙" })
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center border-2 border-blue-200 shadow-xl">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🌻</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Дякую! Thank You!</h3>
              <p className="text-lg text-gray-600">
                Your message brings joy to Ukrainian children. Ваше повідомлення приносить радість!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">🇺🇦</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Messages for Ukrainian Children</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Send a message of hope and love to Ukrainian orphan children in Portland.
            <br />
            <span className="text-blue-600 font-medium">Надішліть повідомлення надії українським дітям!</span>
          </p>
        </div>

        <Card className="max-w-2xl mx-auto border-2 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Heart className="h-6 w-6 text-white" />
              Send Love to Ukrainian Children
              <span className="text-sm font-normal">💛</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name / Ваше ім'я
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
                    placeholder="Your name..."
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Age / Ваш вік
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="3"
                    max="99"
                    required
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
                    placeholder="Age..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline h-4 w-4 mr-1" />
                  Language / Мова
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
                >
                  <option value="english">English</option>
                  <option value="ukrainian">Українська</option>
                  <option value="both">Both / Обидві</option>
                </select>
              </div>

              <div>
                <label htmlFor="emoji" className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Your Heart / Оберіть серце
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`text-3xl p-3 rounded-lg border-2 transition-all ${
                        formData.emoji === emoji
                          ? "border-blue-400 bg-blue-100 scale-110 shadow-lg"
                          : "border-blue-200 hover:border-blue-300 bg-white hover:bg-blue-50"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message of Hope / Ваше повідомлення надії
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg resize-none"
                  placeholder="Write a message of hope, encouragement, or love for Ukrainian children..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500 text-white font-bold py-4 text-lg rounded-lg shadow-lg border-2 border-blue-300"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message of Love {formData.emoji}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow-lg border-2 border-yellow-200">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About Our Ukrainian Children Program</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your messages are translated and shared with Ukrainian orphan children who have found refuge in Portland.
              These messages of hope help them feel connected to a caring global community during their healing journey.
              <br />
              <span className="text-blue-600 font-medium mt-2 block">
                Ваші повідомлення допомагають дітям відчути підтримку світової спільноти. 💙💛
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
