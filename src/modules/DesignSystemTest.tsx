/**
 * Página de Teste do Design System
 * Conforme ROADMAP.md - FASE 2.5
 */

import React from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Input } from '../shared/components/ui';
import { colors } from '../shared/styles/tokens';

const DesignSystemTest: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
        Design System - SIVEPI V2
      </h1>

      {/* Buttons */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button fullWidth>Full Width</Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Badge variant="low">Risco Baixo</Badge>
            <Badge variant="medium">Risco Médio</Badge>
            <Badge variant="high">Risco Alto</Badge>
            <Badge variant="critical">Risco Crítico</Badge>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <Card padding="sm">
          <CardTitle>Small Padding</CardTitle>
          <CardContent>Content with small padding</CardContent>
        </Card>
        
        <Card padding="md">
          <CardTitle>Medium Padding</CardTitle>
          <CardContent>Content with medium padding (default)</CardContent>
        </Card>
        
        <Card padding="lg">
          <CardTitle>Large Padding</CardTitle>
          <CardContent>Content with large padding</CardContent>
        </Card>
      </div>

      {/* Inputs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gap: '16px' }}>
            <Input label="Nome" placeholder="Digite seu nome" />
            <Input label="Email" type="email" placeholder="seu@email.com" helperText="Nunca compartilharemos seu email" />
            <Input label="Senha" type="password" error="Senha deve ter no mínimo 8 caracteres" />
            <Input fullWidth label="Comentário" placeholder="Digite um comentário..." />
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Color Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Brand Colors</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div>
                <div style={{ width: '100px', height: '100px', backgroundColor: colors.brand.primary, borderRadius: '8px' }} />
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Primary</p>
              </div>
              <div>
                <div style={{ width: '100px', height: '100px', backgroundColor: colors.brand.secondary, borderRadius: '8px' }} />
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Secondary</p>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Risk Colors</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div>
                <div style={{ width: '100px', height: '100px', backgroundColor: colors.risk.low, borderRadius: '8px' }} />
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Low</p>
              </div>
              <div>
                <div style={{ width: '100px', height: '100px', backgroundColor: colors.risk.medium, borderRadius: '8px' }} />
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Medium</p>
              </div>
              <div>
                <div style={{ width: '100px', height: '100px', backgroundColor: colors.risk.high, borderRadius: '8px' }} />
                <p style={{ fontSize: '12px', marginTop: '4px' }}>High</p>
              </div>
              <div>
                <div style={{ width: '100px', height: '100px', backgroundColor: colors.risk.critical, borderRadius: '8px' }} />
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Critical</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignSystemTest;
