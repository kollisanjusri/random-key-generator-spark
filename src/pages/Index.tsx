
import { Helmet } from 'react-helmet';
import PasswordGenerator from "@/components/PasswordGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center p-4">
      <Helmet>
        <title>Random Password Generator</title>
        <meta name="description" content="Generate secure and random passwords with customizable options" />
      </Helmet>
      <PasswordGenerator />
    </div>
  );
};

export default Index;
