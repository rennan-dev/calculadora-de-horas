import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, Clock, RotateCcw, History, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

function App() {
  const [hours1, setHours1] = useState("")
  const [minutes1, setMinutes1] = useState("")
  const [hours2, setHours2] = useState("")
  const [minutes2, setMinutes2] = useState("")
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const { toast } = useToast()

  const handleInputChange = (value, setter, maxLength, maxValue) => {
    if(value.length <= maxLength && !isNaN(value)) {
      const numValue = parseInt(value || "0")
      if(numValue <= maxValue) {
        setter(value)
      }
    }
  }

  const validateInput = (value, max) => {
    const num = parseInt(value)
    if(isNaN(num) || num < 0 || num > max) {
      return false
    }
    return true
  }

  const handleCalculate = (operation) => {
    if(
      !validateInput(hours1, 23) ||
      !validateInput(minutes1, 59) ||
      !validateInput(hours2, 23) ||
      !validateInput(minutes2, 59)
    ) {
      toast({
        title: "Entrada inválida",
        description:
          "Por favor, insira valores válidos para horas (0-23) e minutos (0-59)",
        variant: "destructive"
      })
      return
    }
  
    const time1 = parseInt(hours1) * 60 + parseInt(minutes1)
    const time2 = parseInt(hours2) * 60 + parseInt(minutes2)
    let totalMinutes
  
    if(operation === "add") {
      //ao somar, se o total ultrapassar 24h (1440 minutos), usa-se o módulo para ajustar
      totalMinutes = (time1 + time2) % 1440
    }else {
      //se o primeiro horário for menor, assumimos que ele é do "próximo dia"
      if(time1 >= time2) {
        totalMinutes = time1 - time2
      }else {
        totalMinutes = time1 + 1440 - time2
      }
    }
  
    const resultHours = Math.floor(totalMinutes / 60)
    const resultMinutes = totalMinutes % 60
  
    const newResult = {
      hours: resultHours,
      minutes: resultMinutes
    }
  
    setResult(newResult)
  
    //adicionar ao histórico
    const historyItem = {
      id: Date.now(),
      time1: `${hours1.padStart(2, "0")}:${minutes1.padStart(2, "0")}`,
      time2: `${hours2.padStart(2, "0")}:${minutes2.padStart(2, "0")}`,
      operation: operation === "add" ? "+" : "-",
      result: `${resultHours.toString().padStart(2, "0")}:${resultMinutes
        .toString()
        .padStart(2, "0")}`
    }
    setHistory((prev) => [historyItem, ...prev].slice(0, 5))
  
    toast({
      title: "Cálculo realizado",
      description: "O resultado foi calculado com sucesso!"
    })
  }
  

  const reset = () => {
    setHours1("")
    setMinutes1("")
    setHours2("")
    setMinutes2("")
    setResult(null)
  }

  const removeFromHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="calculator-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-primary">
              <Clock className="h-6 w-6" />
              Calculadora de Horas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <input
                  type="text"
                  value={hours1}
                  onChange={(e) =>
                    handleInputChange(e.target.value, setHours1, 2, 23)
                  }
                  placeholder="00"
                  className="time-input"
                  maxLength={2}
                />
                <span className="text-2xl font-bold">:</span>
                <input
                  type="text"
                  value={minutes1}
                  onChange={(e) =>
                    handleInputChange(e.target.value, setMinutes1, 2, 59)
                  }
                  placeholder="00"
                  className="time-input"
                  maxLength={2}
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <input
                  type="text"
                  value={hours2}
                  onChange={(e) =>
                    handleInputChange(e.target.value, setHours2, 2, 23)
                  }
                  placeholder="00"
                  className="time-input"
                  maxLength={2}
                />
                <span className="text-2xl font-bold">:</span>
                <input
                  type="text"
                  value={minutes2}
                  onChange={(e) =>
                    handleInputChange(e.target.value, setMinutes2, 2, 59)
                  }
                  placeholder="00"
                  className="time-input"
                  maxLength={2}
                />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleCalculate("add")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Somar
              </Button>
              <Button
                onClick={() => handleCalculate("subtract")}
                className="flex items-center gap-2"
              >
                <Minus className="h-4 w-4" />
                Subtrair
              </Button>
              <Button
                variant="outline"
                onClick={reset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Limpar
              </Button>
            </div>

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="result-display"
              >
                {result.hours.toString().padStart(2, "0")}:
                {result.minutes.toString().padStart(2, "0")}
              </motion.div>
            )}

            {history.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <History className="h-4 w-4" />
                  <h3 className="font-semibold">Histórico</h3>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between bg-primary/5 rounded-lg p-2 text-sm"
                      >
                        <span>
                          {item.time1} {item.operation} {item.time2} = {item.result}
                        </span>
                        <button
                          onClick={() => removeFromHistory(item.id)}
                          className="text-primary/60 hover:text-primary transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <Toaster />
    </div>
  )
}

export default App