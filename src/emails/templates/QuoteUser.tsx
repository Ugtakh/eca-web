import { Section, Text } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';

export const QuoteUserEmail = ({ data }: any) => {
  return (
    <EmailLayout>
      <Section style={{ padding: '30px' }}>
        <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>Сайн байна уу, {data.name}</Text>

        <Text>Таны хүсэлтийг хүлээн авлаа.</Text>

        <Section style={{ background: '#f9fafb', padding: '15px' }}>
          <Text>
            <b>Компани:</b> {data.company || '-'}
          </Text>
          <Text>
            <b>Утас:</b> {data.phone}
          </Text>
          <Text>{data.description}</Text>
        </Section>
      </Section>
    </EmailLayout>
  );
};
