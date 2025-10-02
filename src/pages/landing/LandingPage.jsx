"use client"

import { useState } from "react"
import { Box } from "@mui/material"
import EnterUsername from "./EnterUsername"
import Roulette from "./Roulette"
import DisplayUsers from "./DisplayUsers"

const LandingPage = () => {
  const [step, setStep] = useState("enter")
  const [data, setData] = useState({})

  const handleNext = (newData) => {
    setData({ ...data, ...newData })
    if (step === "enter") {
      setStep("roulette")
    } else if (step === "roulette") {
      setStep("display")
    }
  }

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {step === "enter" && <EnterUsername onNext={handleNext} />}
      {step === "roulette" && (
        <Roulette username={data.username} project={data.project} userId={data.userId} onNext={handleNext} />
      )}
      {step === "display" && (
        <DisplayUsers
          username={data.username}
          project={data.project}
          userId={data.userId}
          users={data.users} // ✅ Pass the users from roulette
          userCount={data.userCount} // ✅ Pass the roulette result
        />
      )}
    </Box>
  )
}

export default LandingPage
