"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Smartphone, Activity, Send, SmilePlus, Smile, Meh, Frown, AlertCircle, Bot, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Mock data for demonstration
const mockData = {
  screenTime: "5h 30m",
  unlocks: 120,
  addictionLevel: "Medium",
};

const moods = [
  { icon: SmilePlus, label: "Very Happy" },
  { icon: Smile, label: "Happy" },
  { icon: Meh, label: "Neutral" },
  { icon: Frown, label: "Sad" },
  { icon: AlertCircle, label: "Very Sad" },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{text: string, sender: string}>>([]);
  const [moodHistory, setMoodHistory] = useState<Array<{mood: string, timestamp: Date}>>([]);

  const handleMoodSubmit = () => {
    if (selectedMood) {
      // Add mood to history
      const newMood = { mood: selectedMood, timestamp: new Date() };
      setMoodHistory(prev => [...prev, newMood]);

      // Add mood submission to chat
      setChatHistory(prev => [
        ...prev,
        { text: `I'm feeling ${selectedMood.toLowerCase()} right now.`, sender: "user" }
      ]);

      // Get AI response based on mood
      setTimeout(() => {
        let response = "";
        switch (selectedMood) {
          case "Very Happy":
            response = "That's wonderful to hear! Your positive mood combined with a screen time of " + 
                      mockData.screenTime + " suggests a good balance. Keep it up! 🌟";
            break;
          case "Happy":
            response = "Good to hear you're happy! Would you like some tips to maintain this positive state while managing your " + 
                      mockData.unlocks + " daily phone checks?";
            break;
          case "Neutral":
            response = "A neutral mood is perfectly okay. I notice you've spent " + mockData.screenTime + 
                      " on your phone today. Would you like to try some engaging offline activities?";
            break;
          case "Sad":
            response = "I'm sorry you're feeling sad. Sometimes excessive phone use can affect our mood. " +
                      "Would you like to try some mood-lifting activities away from screens?";
            break;
          case "Very Sad":
            response = "I'm here to support you. Your current screen time is " + mockData.screenTime + 
                      ". Research shows reducing screen time can help improve mood. Would you like to talk about it?";
            break;
        }
        setChatHistory(prev => [...prev, { text: response, sender: "bot" }]);
      }, 1000);

      setSelectedMood("");
    }
  };

  // Get last mood if exists
  const getLastMood = () => {
    if (moodHistory.length === 0) return null;
    return moodHistory[moodHistory.length - 1];
  };

  // Helper function to generate contextual responses
  const getBotResponse = (message: string) => {
    const msg = message.toLowerCase();
    
    // Check for screen time related queries
    if (msg.includes("screen time") || msg.includes("usage")) {
      if (parseInt(mockData.screenTime) > 5) {
        return "Your screen time of " + mockData.screenTime + " is above recommended levels. Try setting app limits or using grayscale mode to reduce usage.";
      } else {
        return "Your screen time of " + mockData.screenTime + " is within healthy limits. Keep maintaining a good digital balance!";
      }
    }
    
    // Check for addiction level queries
    if (msg.includes("addiction") || msg.includes("addicted")) {
      if (mockData.addictionLevel === "High") {
        return "I notice your addiction risk is high. Let's work on some strategies: 1) Set app timers 2) Take regular breaks 3) Find offline activities you enjoy";
      } else if (mockData.addictionLevel === "Medium") {
        return "Your addiction level is moderate. To improve, try: 1) No phone during meals 2) Keep phone away while sleeping 3) Use focus mode when working";
      } else {
        return "You're maintaining a healthy relationship with your phone. Great job!";
      }
    }
    
    // Check for unlock patterns
    if (msg.includes("unlock") || msg.includes("check")) {
      if (mockData.unlocks > 100) {
        return "You've unlocked your phone " + mockData.unlocks + " times today. That's quite frequent! Try keeping your phone face-down or in another room when focusing.";
      } else {
        return "Your unlock count of " + mockData.unlocks + " is reasonable. Remember, fewer checks often mean better focus!";
      }
    }
    
    // Check for help or tips
    if (msg.includes("help") || msg.includes("tip") || msg.includes("advice")) {
      return "Here are some tips to maintain digital wellbeing:\n1) Use Night Light mode\n2) Take regular screen breaks\n3) Enable Do Not Disturb during work\n4) Practice mindful usage";
    }
    
    // Check for mood-related queries
    if (msg.includes("feel") || msg.includes("mood")) {
      const lastMood = getLastMood();
      if (lastMood) {
        const timeAgo = Math.round((new Date().getTime() - lastMood.timestamp.getTime()) / 60000);
        return `Your last recorded mood was ${lastMood.mood.toLowerCase()} (${timeAgo} minutes ago). ` +
               `Would you like to update how you're feeling now?`;
      }
      return "You haven't shared your mood yet. Try using the mood tracker above!";
    }
    
    // Default responses for general queries
    const defaultResponses = [
      "How can I help you manage your smartphone usage better?",
      "Would you like some tips for digital wellbeing?",
      "I'm here to help you maintain a healthy relationship with technology.",
      "Let me know if you'd like to discuss your usage patterns."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleChatSubmit = () => {
    if (chatMessage.trim()) {
      setChatHistory([...chatHistory, { text: chatMessage, sender: "user" }]);
      
      // Get contextual bot response
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          text: getBotResponse(chatMessage), 
          sender: "bot" 
        }]);
      }, 1000);
      
      setChatMessage("");
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12">Smartphone Usage Monitor</h1>
        
        {/* Dashboard Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Screen Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockData.screenTime}</p>
              <p className="text-sm text-gray-500 mt-1">Today's usage</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Unlocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockData.unlocks}</p>
              <p className="text-sm text-gray-500 mt-1">Times today</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Addiction Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockData.addictionLevel}</p>
              <p className="text-sm text-gray-500 mt-1">Current status</p>
            </CardContent>
          </Card>
        </section>

        {/* Mood Tracking Section */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow relative">
          {moodHistory.length > 0 && (
            <div className="absolute -top-3 right-4 bg-black text-white px-3 py-1 rounded-full text-sm">
              {moodHistory.length} moods tracked
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              How are you feeling today?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`p-4 rounded-lg transition-all ${
                    selectedMood === mood.label
                      ? "bg-black text-white scale-105 shadow-lg"
                      : "bg-white border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <mood.icon className="w-8 h-8" />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <Button
              onClick={handleMoodSubmit}
              disabled={!selectedMood}
              className={`w-full py-6 text-base font-medium transition-colors ${
                selectedMood 
                  ? "bg-black hover:bg-gray-800 text-white" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Mood
            </Button>
          </CardContent>
        </Card>

        {/* Chatbot Section */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow min-h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Bot className="w-5 h-5" /> Chat with AI Assistant
            </CardTitle>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Get help managing your smartphone usage
            </p>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="h-full flex flex-col">
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Bot className="w-5 h-5" />
                  <span>AI Assistant • Always here to help</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatHistory.length === 0 ? (
                  <div className="text-center space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6 mx-auto max-w-sm">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="font-medium mb-2">Hi! I'm your digital wellbeing assistant.</p>
                      <p className="text-sm text-gray-500 mb-4">Ask me about your screen time, usage patterns, or tips for better digital habits!</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <button 
                          onClick={() => setChatMessage("How's my screen time?")}
                          className="p-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          🕒 Check screen time
                        </button>
                        <button 
                          onClick={() => setChatMessage("What's my addiction level?")}
                          className="p-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          📊 View addiction level
                        </button>
                        <button 
                          onClick={() => setChatMessage("Give me some tips")}
                          className="p-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          💡 Get usage tips
                        </button>
                        <button 
                          onClick={() => setChatMessage("How many times did I unlock?")}
                          className="p-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          🔓 Check unlocks
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`relative p-4 rounded-2xl max-w-[80%] ${
                          msg.sender === "user"
                            ? "bg-black text-white rounded-tr-none"
                            : "bg-gray-100 rounded-tl-none"
                        }`}
                      >
                        {msg.sender === "bot" && (
                          <Bot className="w-4 h-4 absolute -left-6 top-2 text-gray-400" />
                        )}
                        <div className="whitespace-pre-line">{msg.text}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="sticky bottom-0 p-4 border-t bg-white flex items-center gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about your screen time, usage, or get tips..."
                onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                className="flex-1"
              />
              <Button 
                onClick={handleChatSubmit}
                className="bg-black hover:bg-gray-800 text-white px-6"
                disabled={!chatMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
