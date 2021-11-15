import React from "react";
import styled from "styled-components";

const Copyright = styled.span`
  color: #aaa;
  font-size: 12px;
  font-weight: normal;
`;

function Footer() {
  return (
    <Container>
      <Project>© 그룹 카운슬링</Project>
      <Copyright> All rights reserved by jisub,yuna </Copyright>
    </Container>
  );
}

export default Footer;
