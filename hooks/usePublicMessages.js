import { useState, useEffect } from "react"
import constant from '../constant'

export default function usePublicMessages() {
  const [latestMessage, setLatestMessage] = useState(null)
  const [latestAnnouncement, setLatestAnnouncement] = useState(null)
  const [messageCount, setMessageCount] = useState(0)
  const [announcementCount, setAnnouncementCount] = useState(0)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${constant.apiUrl}/public-messages`)
        const data = await res.json()
        // Separate by type
        const messages = data.filter(msg => msg.type === "Message")
        const announcements = data.filter(msg => msg.type === "Announcement")
        // Sort by date descending
        messages.sort((a, b) => new Date(b.date) - new Date(a.date))
        announcements.sort((a, b) => new Date(b.date) - new Date(a.date))

        setLatestMessage(messages[0] || null)
        setMessageCount(messages.length)
        setLatestAnnouncement(announcements[0] || null)
        setAnnouncementCount(announcements.length)
      } catch (err) {
        // handle error
      }
    }
    fetchMessages()
  }, [])

  return {
    latestMessage,
    latestAnnouncement,
    messageCount,
    announcementCount
  }
}