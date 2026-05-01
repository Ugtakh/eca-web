import { Html, Head, Body, Container, Section, Img, Text } from '@react-email/components';

export default function EmailLayout({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head />
      <Body style={{ background: '#f5f7fb', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', background: '#fff' }}>
          <Section style={{ background: '#0f172a', padding: '20px', textAlign: 'center' }}>
            <Img src="https://www.eca.mn/assets/images/dark.png" width="120" />
          </Section>

          {children}

          <Section style={{ background: '#f3f4f6', padding: '20px', textAlign: 'center' }}>
            <Text style={{ fontSize: '12px', color: '#6b7280' }}>
              © 2026 И СИ ЭЙ ИНЖЕНЕРИНГ ХХК
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
