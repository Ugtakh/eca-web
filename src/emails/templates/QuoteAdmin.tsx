import { Section, Text } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';

export const QuoteAdminEmail = ({ data }: any) => {
  return (
    <EmailLayout>
      <Section style={{ padding: '30px' }}>
        <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>📩 Шинэ хүсэлт</Text>

        <Text>
          <b>Нэр:</b> {data.name}
        </Text>
        <Text>
          <b>Email:</b> {data.email}
        </Text>
        <Text>
          <b>Утас:</b> {data.phone}
        </Text>
        <Text>
          <b>Компани:</b> {data.company}
        </Text>
        <Text>{data.description}</Text>
      </Section>
    </EmailLayout>
  );
};
