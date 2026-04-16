'use client';

import { useState, useTransition } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';

// import gridImg from '@/assets/images/grid-01.svg';
// import logo from '@/assets/logos/vertical-msa-logo-light-mon.svg';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/actions/auth';
import { toast } from 'react-toastify';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await signIn(email, password);

        if (!result.status) {
          throw result.error;
        }
        router.replace('/admin');
        toast.success(`Нэвтрэлт амжилттай`);
      } catch (error) {
        if (error instanceof Error) {
          let message = '';
          switch (error.message) {
            case 'Invalid `password` param: Password must be between 8 and 256 characters long.': {
              message = 'Таны нууц үг 8 дээш тэмдэгт байх ёстой';
              break;
            }
            case 'Invalid credentials. Please check the email and password.': {
              message = 'Таны имэйл эсвэл нууц үг буруу байна';
              break;
            }
            case 'Rate limit for the current endpoint has been exceeded. Please try again after some time.': {
              message = 'Таны түр хүлээж байгаад дараа дахин оролдоно уу';
              break;
            }
            default:
              message = 'Алдаа';
          }
          toast.error(`Нэвтрэлт амжилтгүй. ${message}`);
        }
      }
    });
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen p-4 overflow-hidden bg-gray-100">
      <style jsx>{`
        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        .login-btn:hover::before {
          left: 100%;
        }
      `}</style>
      <div className="w-full max-w-6xl">
        <div className=" overflow-hidden rounded-[40px] shadow-2xl">
          <div className="grid min-h-[500px] lg:grid-cols-2">
            {/* Left Side bg-linear-to-bl*/}
            <div className="relative p-12 text-white brand-side bg-gradient-to-bl from-secondary to-primary">
              <div className="flex flex-col items-center h-full">
                <div className="relative w-full h-full">
                  <Image src={'/assets/images/grid-01.svg'} alt="grid" fill className="z-10" />
                  <div className="z-50 flex flex-col items-center justify-center h-12/12">
                    <Image
                      src={'/assets/images/grid-01.svg'}
                      alt="grid"
                      width={130}
                      height={130}
                      className="z-20"
                    />
                    <div className="flex flex-col items-center justify-center h-full mt-4 font-bold uppercase ">
                      <span className="text-8xl">ECA</span>
                      <span className="text-[28px]">Engineering</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col justify-center p-12 text-secondary">
              <div className="w-full max-w-md mx-auto">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-semibold uppercase">Админ Удирдлага</h2>
                  <p className="mt-2 text-sm text-muted-foreground ">
                    бүртгэлтэй хэрэглэгчээр нэвтэрнэ үү
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium uppercase">
                      Имэйл хаяг
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="w-5 h-5 text-secondary" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="block w-full py-3 pl-10 pr-3 text-sm bg-gray-100 border rounded-lg text-secondary border-secondary placeholder-inherit"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium uppercase">
                      Нууц үг
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="w-5 h-5 text-secondary" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full py-3 pl-10 pr-12 text-sm bg-gray-100 border rounded-lg text-secondary border-secondary placeholder-inherit"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-secondary" />
                        ) : (
                          <Eye className="w-5 h-5 text-secondary" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="relative flex items-center justify-center w-full px-4 py-3 overflow-hidden text-sm font-bold text-white transition-all duration-300 rounded-lg login-btn bg-gradient-to-r to-secondary/80 from-secondary/95 hover:cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="ml-2">Нэвтэрч байна...</span>
                      </>
                    ) : (
                      'Нэвтрэх'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
