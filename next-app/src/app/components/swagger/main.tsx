"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUIComponent = () => {
  return (
    <div id="apiSpecs">
      <SwaggerUI url="/data/openapi.yaml" />
    </div>
  );
};

export default SwaggerUIComponent;
