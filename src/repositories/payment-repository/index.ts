import { prisma } from "@/config";
import { Payment, TicketStatus } from "@prisma/client";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(ticketId: number, params: PaymentParams): Promise<Payment> {
  const payment = prisma.payment.create({
    data: {
      ticketId,
      ...params,
    },
  });
  const ticketUpdate = prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
  prisma.$transaction([payment, ticketUpdate]);
  return payment;
}

export type PaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">;

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
};

export default paymentRepository;
