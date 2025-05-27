import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "../ui/button"
import React from "react"
interface ThemeToggleProps extends React.HTMLAttributes<HTMLButtonElement> { }

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(({ className, ...props }, ref) => {
  const { setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => setTheme((theme) => (theme === "light" ? "dark" : "light"))}
      {...props}
      ref={ref}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
})
ThemeToggle.displayName = "ThemeToggle"

