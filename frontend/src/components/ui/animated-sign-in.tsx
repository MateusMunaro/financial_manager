"use client";

import React, { useState, useEffect } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/lib/styles/colors";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

const AnimatedSignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme, toggleTheme, getThemeColor } = useTheme();
  const router = useRouter();
  const { login, error } = useAuthContext();
  const isDarkMode = theme === "dark";

  // Email validation
  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value) {
      setIsEmailValid(validateEmail(e.target.value));
    } else {
      setIsEmailValid(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    if (email && password && validateEmail(email)) {
      setIsSubmitting(true);

      try {
        const success = await login({ email, password });

        if (success) {
          const form = document.querySelector(".login-form") as HTMLElement;
          if (form) {
            form.classList.add("form-success");
            setTimeout(() => {
              router.push("/dashboard");
            }, 1000);
          }
        }
      } catch (err) {
        console.error("Login error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Create particles
  useEffect(() => {
    const canvas = document.getElementById("particles") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = isDarkMode
          ? `rgba(193, 232, 255, ${Math.random() * 0.2})`
          : `rgba(5, 38, 89, ${Math.random() * 0.15})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(
      100,
      Math.floor((canvas.width * canvas.height) / 15000)
    );

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [isDarkMode]);

  return (
    <div
      className="login-container"
      style={{
        backgroundColor: getThemeColor(colors.background.default),
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        id="particles"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      ></canvas>

      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: "2rem",
          right: "2rem",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: getThemeColor(colors.background.glass),
          backdropFilter: "blur(12px)",
          border: `1px solid ${getThemeColor(colors.border.default)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          color: getThemeColor(colors.text.primary),
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = getThemeColor(colors.shadow.glow);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
      </button>

      <div
        className="login-card"
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "3rem",
          borderRadius: "24px",
          backgroundColor: getThemeColor(colors.background.glass),
          backdropFilter: "blur(24px)",
          border: `1px solid ${getThemeColor(colors.border.default)}`,
          boxShadow: getThemeColor(colors.shadow.lg),
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="login-header" style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
              color: getThemeColor(colors.text.primary),
              background: getThemeColor(colors.gradient.glass),
              borderRadius: "12px"
            }}
          >
            Bem-vindo
          </h1>
          <p style={{ fontSize: "1rem", color: getThemeColor(colors.text.secondary) }}>
            Entre para continuar
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          {error && (
            <div
              style={{
                padding: "1rem",
                borderRadius: "12px",
                marginBottom: "1rem",
                backgroundColor: getThemeColor(colors.semantic.negative) + "20",
                border: `1px solid ${getThemeColor(colors.semantic.negative)}`,
              }}
            >
              <p style={{ color: getThemeColor(colors.semantic.negative), fontSize: "0.875rem" }}>
                {error}
              </p>
            </div>
          )}

          <div style={{ marginBottom: "1.5rem", position: "relative" }}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              required
              style={{
                width: "100%",
                padding: "1rem",
                paddingTop: "1.5rem",
                borderRadius: "12px",
                border: `2px solid ${
                  !isEmailValid && email
                    ? getThemeColor(colors.semantic.negative)
                    : isEmailFocused || email
                    ? getThemeColor(colors.input.borderFocus)
                    : getThemeColor(colors.input.border)
                }`,
                backgroundColor: getThemeColor(colors.input.background),
                backdropFilter: "blur(12px)",
                fontSize: "1rem",
                color: getThemeColor(colors.text.primary),
                outline: "none",
                transition: "all 0.3s ease",
              }}
            />
            <label
              htmlFor="email"
              style={{
                position: "absolute",
                left: "1rem",
                top: isEmailFocused || email ? "0.5rem" : "50%",
                transform: isEmailFocused || email ? "translateY(0)" : "translateY(-50%)",
                fontSize: isEmailFocused || email ? "0.75rem" : "1rem",
                color: getThemeColor(colors.text.secondary),
                pointerEvents: "none",
                transition: "all 0.3s ease",
              }}
            >
              Email
            </label>
            {!isEmailValid && email && (
              <span
                style={{
                  display: "block",
                  marginTop: "0.5rem",
                  fontSize: "0.75rem",
                  color: getThemeColor(colors.semantic.negative),
                }}
              >
                Por favor, insira um email válido
              </span>
            )}
          </div>

          <div style={{ marginBottom: "1.5rem", position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
              style={{
                width: "100%",
                padding: "1rem",
                paddingTop: "1.5rem",
                paddingRight: "3rem",
                borderRadius: "12px",
                border: `2px solid ${
                  isPasswordFocused || password
                    ? getThemeColor(colors.input.borderFocus)
                    : getThemeColor(colors.input.border)
                }`,
                backgroundColor: getThemeColor(colors.input.background),
                backdropFilter: "blur(12px)",
                fontSize: "1rem",
                color: getThemeColor(colors.text.primary),
                outline: "none",
                transition: "all 0.3s ease",
              }}
            />
            <label
              htmlFor="password"
              style={{
                position: "absolute",
                left: "1rem",
                top: isPasswordFocused || password ? "0.5rem" : "50%",
                transform: isPasswordFocused || password ? "translateY(0)" : "translateY(-50%)",
                fontSize: isPasswordFocused || password ? "0.75rem" : "1rem",
                color: getThemeColor(colors.text.secondary),
                pointerEvents: "none",
                transition: "all 0.3s ease",
              }}
            >
              Senha
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: getThemeColor(colors.text.secondary),
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                transition: "color 0.3s ease",
              }}
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "0.875rem",
                color: getThemeColor(colors.text.secondary),
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                style={{
                  width: "18px",
                  height: "18px",
                  marginRight: "0.5rem",
                  cursor: "pointer",
                  accentColor: getThemeColor(colors.brand.primary),
                }}
              />
              Lembrar-me
            </label>

            <a
              href="#"
              style={{
                fontSize: "0.875rem",
                color: getThemeColor(colors.brand.primary),
                textDecoration: "none",
                fontWeight: "500",
                transition: "opacity 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (isFormSubmitted && (!email || !password || !isEmailValid))}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              backgroundColor: getThemeColor(colors.button.primary.background),
              color: getThemeColor(colors.button.primary.text),
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: isSubmitting ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = getThemeColor(
                  colors.button.primary.hover
                );
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = getThemeColor(colors.shadow.glow);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = getThemeColor(
                colors.button.primary.background
              );
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem",
            color: getThemeColor(colors.text.secondary),
            fontSize: "0.875rem",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: getThemeColor(colors.border.default),
            }}
          ></div>
          <span style={{ padding: "0 1rem" }}>ou continue com</span>
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: getThemeColor(colors.border.default),
            }}
          ></div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          {[
            { name: "github", label: "G" },
            { name: "twitter", label: "T" },
            { name: "linkedin", label: "in" },
          ].map(({ name, label }) => (
            <button
              key={name}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                border: `1px solid ${getThemeColor(colors.border.default)}`,
                backgroundColor: getThemeColor(colors.background.glass),
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                color: getThemeColor(colors.text.primary),
                fontSize: "1rem",
                fontWeight: "600",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = getThemeColor(colors.brand.primary);
                e.currentTarget.style.boxShadow = getThemeColor(colors.shadow.md);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = getThemeColor(colors.border.default);
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            color: getThemeColor(colors.text.secondary),
          }}
        >
          Não tem uma conta?{" "}
          <a
            href="/register"
            style={{
              color: getThemeColor(colors.brand.primary),
              textDecoration: "none",
              fontWeight: "600",
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
};

export default AnimatedSignIn;
