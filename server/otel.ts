import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

// Determine exporter – OTLP HTTP if endpoint specified, else undefined (dev mode without console spam)
const exporter = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  ? new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT })
  : undefined;

const sdk = new NodeSDK({
  ...(exporter && { traceExporter: exporter }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
console.log('✅ OpenTelemetry initialized');

process.on('SIGTERM', () => {
  sdk.shutdown().then(() => {
    console.log('OpenTelemetry terminated');
  });
}); 