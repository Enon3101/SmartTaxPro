import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';

// Determine exporter – OTLP HTTP if endpoint specified, else console (dev)
const exporter = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  ? new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT })
  : new ConsoleSpanExporter();

const sdk = new NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start().then(() => {
  console.log('✅ OpenTelemetry initialized');
});

process.on('SIGTERM', () => {
  sdk.shutdown().then(() => {
    console.log('OpenTelemetry terminated');
  });
}); 