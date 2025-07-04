"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Send, Smile, Globe } from "lucide-react"

export default function KidsMessageForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    message: "",
    isUkrainian: false,
    emoji: "😊",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const emojis = ["😊", "😄", "🥰", "😇", "🤗", "🌟", "❤️", "🙏", "🇺🇦", "💙", "💛", "🌻"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Kids message submitted to Bozhiymir Church:", formData)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", age: "", message: "", isUkrainian: false, emoji: "😊" })
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center border-2 border-blue-200 shadow-xl">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {formData.isUkrainian ? "Дякую! Thank You!" : "Thank You!"}
              </h3>
              <p className="text-lg text-gray-600">
                Your message brings joy to our Bozhiymir Church family!
                {formData.isUkrainian && (
                  <span className="block text-blue-600 mt-2">
                    Ваше повідомлення приносить радість нашій церковній родині! 💙💛
                  </span>
                )}
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
          <div className="text-4xl mb-4">👶✨</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Kids Corner</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hey kids! We'd love to hear from you. Send us a message, tell us about your day, or share what you're
            thankful for!
            <br />
            <span className="text-blue-600 font-medium">Привіт, діти! Ми хочемо почути від вас! 🇺🇦</span>
          </p>
        </div>

        <Card className="max-w-2xl mx-auto border-2 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-yellow-100">
            <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
              <Heart className="h-6 w-6 text-red-500" />
              Send Us a Message
              <Globe className="h-5 w-5 text-blue-600" />
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
                    placeholder="What's your name?"
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
                    max="18"
                    required
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
                    placeholder="How old are you?"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isUkrainian"
                  name="isUkrainian"
                  checked={formData.isUkrainian}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isUkrainian" className="text-sm font-medium text-gray-700">
                  🇺🇦 I am Ukrainian / Я українець/українка
                </label>
              </div>

              <div>
                <label htmlFor="emoji" className="block text-sm font-medium text-gray-700 mb-2">
                  Pick Your Mood / Оберіть настрій
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
                  Your Message / Ваше повідомлення
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg resize-none"
                  placeholder="Tell us about your day, what you're thankful for, or anything you want to share!"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500 text-white font-bold py-4 text-lg rounded-lg shadow-lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Send My Message {formData.emoji}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow-lg border-2 border-blue-200">
            <Smile className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">For Parents & Guardians</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              All messages are reviewed by our children's ministry team at Bozhiymir Church. We love connecting with all
              our young church members, including our Ukrainian children who are part of our special ministry program.
              <br />
              <span className="text-blue-600 font-medium mt-2 block">
                Всі повідомлення переглядаються нашою командою дитячого служіння. 💙
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
