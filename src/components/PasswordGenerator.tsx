
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, Copy, Lock, Check } from "lucide-react";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // Generate password on mount and when options change
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Calculate password strength when password changes
  useEffect(() => {
    calculatePasswordStrength();
  }, [password]);

  const generatePassword = () => {
    let charset = "";
    let newPassword = "";

    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Ensure at least one character set is selected
    if (charset === "") {
      setIncludeLowercase(true);
      charset = "abcdefghijklmnopqrstuvwxyz";
    }

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
    setIsCopied(false);
  };

  const calculatePasswordStrength = () => {
    // Simple strength calculation based on length and character sets
    let strength = 0;
    
    // Length factor (max 40%)
    strength += Math.min(40, (password.length / 20) * 40);
    
    // Character set diversity (max 60%)
    let diversity = 0;
    if (/[a-z]/.test(password)) diversity += 15;
    if (/[A-Z]/.test(password)) diversity += 15;
    if (/[0-9]/.test(password)) diversity += 15;
    if (/[^a-zA-Z0-9]/.test(password)) diversity += 15;
    
    strength += diversity;
    setPasswordStrength(Math.round(strength));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(
      () => {
        setIsCopied(true);
        toast.success("Password copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy password");
      }
    );
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Good";
    return "Strong";
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          <CardTitle className="text-2xl font-bold">Password Generator</CardTitle>
        </div>
        <CardDescription>
          Create strong, secure passwords for your accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <div className="flex items-center border-2 rounded-md bg-slate-50 overflow-hidden">
            <div className="flex-1 px-4 py-3">
              <Input
                className="border-0 p-0 focus-visible:ring-0 text-lg bg-transparent"
                type="text"
                value={password}
                readOnly
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mr-1 text-slate-500 hover:text-indigo-600 focus:text-indigo-600"
              onClick={copyToClipboard}
            >
              {isCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Length: {length}</label>
              <span className="text-xs text-slate-500">8-32 characters</span>
            </div>
            <Slider
              value={[length]}
              min={8}
              max={32}
              step={1}
              className="cursor-pointer"
              onValueChange={(value) => setLength(value[0])}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Include:</label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                />
                <label htmlFor="uppercase" className="text-sm cursor-pointer">
                  Uppercase (A-Z)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                />
                <label htmlFor="lowercase" className="text-sm cursor-pointer">
                  Lowercase (a-z)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                />
                <label htmlFor="numbers" className="text-sm cursor-pointer">
                  Numbers (0-9)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                />
                <label htmlFor="symbols" className="text-sm cursor-pointer">
                  Symbols (!@#$%)
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Strength: {getStrengthText()}</label>
              <span className="text-xs text-slate-500">{passwordStrength}%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full py-6 text-base bg-indigo-600 hover:bg-indigo-700 transition-all"
          onClick={generatePassword}
        >
          <Lock className="mr-2 h-5 w-5" /> Generate New Password
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PasswordGenerator;
