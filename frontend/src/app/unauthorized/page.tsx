"use client";

import styled from "styled-components";
import { federatedSignOut } from "@/features/shared/auth/actions";
import { theme } from "@/styles/theme";

export default function UnauthorizedPage() {
  return (
    <Screen>
      <Card>
        <h1>403</h1>
        <Muted>
          You don&apos;t have a role that grants access to this module. Ask an
          admin to assign you a module role in Keycloak.
        </Muted>
        <Actions>
          <PrimaryLink href="/">My dashboard</PrimaryLink>
          <form action={federatedSignOut}>
            <GhostButton type="submit">Sign out</GhostButton>
          </form>
        </Actions>
      </Card>
    </Screen>
  );
}

const Screen = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
`;
const Card = styled.div`
  background: #fff;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 440px;

  h1 {
    margin: 0;
    font-size: 2.4rem;
    color: ${theme.navy};
  }
`;
const Muted = styled.p`
  color: #6b6b80;
  font-size: 0.9rem;
`;
const Actions = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;
const PrimaryLink = styled.a`
  display: inline-block;
  background: linear-gradient(180deg, ${theme.red2}, ${theme.red});
  color: #fff;
  font-weight: 600;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;

  &:hover {
    filter: brightness(1.06);
  }
`;
const GhostButton = styled.button`
  background: transparent;
  color: ${theme.red2};
  border: 1px solid #f0c9ce;
  font-weight: 600;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #fdeaea;
  }
`;
