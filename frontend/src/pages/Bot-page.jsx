import React, { useState } from 'react';
import { Search, Send, Pill, Calendar, X, Plus, ArrowLeft } from 'lucide-react';

const PharmaChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [medicationSchedule, setMedicationSchedule] = useState([]);
  const [streakCount, setStreakCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '09:00', notes: '' });

  const formatDrugInfo = (drug) => {
    return `💊 **${drug.name}** (${drug.brand})
📋 ${drug.type}

**🎯 What it's for:**
${drug.uses}

**📏 How to take it:**
${drug.dosage}

**⚠️ Side effects:**
${drug.sideEffects}

**🚨 Warnings:**
${drug.warnings}

---
💡 Always follow your doctor's instructions!`;
  };

  const generateResponse = async (userMessage) => {
    const message = userMessage.toLowerCase().trim();

    if (message.includes('schedule')) {
      setShowSchedule(true);
      return '📅 Opening your medication calendar!';
    }

    if (message.includes('help')) {
      return `🏥 **PharmAssist Pro**\n\nI can help with:\n• Medication info: "ibuprofen", "aspirin"\n• Schedule: "schedule"\n• Questions: "What is lisinopril?"\n\n🔙 Navigate with back buttons\n📱 Scroll on all pages`;
    }

    let drugName = message;
    if (message.includes('what is')) {
      drugName = message.replace(/what is|the|medication|medicine|drug/g, '').trim();
    }

    if (drugName.length < 2) {
      return `👋\n\nTry:\n• "ibuprofen" or "aspirin"\n• "schedule" for calendar\n• "help" for options\n\n💊 I have info on common medications!`;
    }

    return `❌ Couldn't find "${drugName}"\n\nTry: acetaminophen, ibuprofen, lisinopril`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', content: inputMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const botResponse = await generateResponse(currentInput);
      setMessages(prev => [...prev, { type: 'bot', content: botResponse, timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: '❌ Error occurred. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const addMedication = () => {
    if (!newMed.name || !newMed.dosage) return;

    const medication = {
      id: Date.now().toString(),
      ...newMed
    };

    setMedicationSchedule(prev => [...prev, medication]);
    setShowAddMed(false);
    setNewMed({ name: '', dosage: '', time: '09:00', notes: '' });

    setMessages(prev => [...prev, {
      type: 'bot',
      content: `🎉 ${medication.name} added!\n💊 ${medication.dosage} at ${medication.time}`,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900">
      {/* Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-slate-800 to-gray-800 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-600">
              <div className="flex items-center">
                <button
                  onClick={() => setShowSchedule(false)}
                  className="text-gray-400 hover:text-white p-2 mr-2 rounded-lg hover:bg-slate-700"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Calendar className="w-8 h-8 mr-3 text-blue-400" />
                  Medication Schedule
                </h2>
              </div>
              <button onClick={() => setShowSchedule(false)} className="text-gray-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">{totalPoints}</div>
                  <div className="text-yellow-100">Points</div>
                </div>
                <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">{streakCount}</div>
                  <div className="text-red-100">Streak</div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-lg text-center">
                  <button
                    onClick={() => setShowAddMed(true)}
                    className="w-full h-full flex flex-col items-center justify-center text-white hover:scale-105 transition-transform"
                  >
                    <Plus className="w-8 h-8 mb-1" />
                    <div>Add Med</div>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {medicationSchedule.length === 0 ? (
                  <div className="text-center py-12">
                    <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No medications yet</h3>
                    <p className="text-gray-400 mb-4">Add your first medication to get started</p>
                    <button
                      onClick={() => setShowAddMed(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Medication
                    </button>
                  </div>
                ) : (
                  medicationSchedule.map(med => (
                    <div key={med.id} className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{med.name}</h3>
                          <p className="text-gray-300">{med.dosage} at {med.time}</p>
                          {med.notes && <p className="text-gray-400 text-sm">📝 {med.notes}</p>}
                        </div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                          ✅ Take
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Med Modal */}
      {showAddMed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-slate-800 to-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-600">
              <div className="flex items-center">
                <button
                  onClick={() => setShowAddMed(false)}
                  className="text-gray-400 hover:text-white p-2 mr-2 rounded-lg hover:bg-slate-700"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-white">Add Medication</h2>
              </div>
              <button onClick={() => setShowAddMed(false)} className="text-gray-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    value={newMed.name}
                    onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500"
                    placeholder="e.g., Lisinopril"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Dosage</label>
                  <input
                    type="text"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                    className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500"
                    placeholder="e.g., 10mg"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Time</label>
                  <input
                    type="time"
                    value={newMed.time}
                    onChange={(e) => setNewMed(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Notes</label>
                  <textarea
                    value={newMed.notes}
                    onChange={(e) => setNewMed(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500"
                    placeholder="e.g., Take with food"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 p-6 border-t border-slate-600">
              <button
                onClick={() => setShowAddMed(false)}
                className="flex-1 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addMedication}
                disabled={!newMed.name || !newMed.dosage}
                className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PharmAssist Pro</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 bg-slate-700 rounded-lg p-3">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{totalPoints}</div>
                <div className="text-xs text-slate-300">Points</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">{streakCount}</div>
                <div className="text-xs text-slate-300">Streak</div>
              </div>
            </div>

            <button
              onClick={() => setShowSchedule(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              📅 Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-4xl p-6 rounded-lg shadow-2xl ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border border-blue-500' 
                : 'bg-gradient-to-r from-slate-800 to-gray-800 text-slate-100 border border-slate-600'
            }`}>
              <div className="whitespace-pre-line text-lg leading-relaxed">
                {message.content.split('**').map((part, i) => 
                  i % 2 === 0 ? part : <strong key={i} className="font-bold">{part}</strong>
                )}
              </div>
              <div className={`text-sm mt-3 ${message.type === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-slate-800 to-gray-800 p-6 rounded-lg shadow-2xl border border-slate-600">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-lg text-slate-300">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-800 border-t border-slate-700 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search medications, ask questions, or type 'help'..."
              className="w-full p-4 pr-16 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg bg-slate-700 text-white placeholder-slate-400"
            />
            <Search className="absolute right-4 top-4 w-6 h-6 text-slate-400" />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-xl border border-blue-500"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 text-center">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 border border-blue-600 rounded-lg p-4">
            <p className="text-lg text-white flex items-center justify-center space-x-2">
              <Pill className="w-5 h-5" />
              <span>Complete medication management • For emergencies, call 911</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default PharmaChatbot;
