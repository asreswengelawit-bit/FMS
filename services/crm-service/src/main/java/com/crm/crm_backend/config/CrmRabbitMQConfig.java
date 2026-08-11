package com.crm.crm_backend.config;

import com.crm.crm_backend.event.CrmRoutingKeys;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CrmRabbitMQConfig {

    public static final String ERP_EVENTS_EXCHANGE = "erp.events";
    public static final String NOTIFICATION_QUEUE = "crm.notification.queue";
    public static final String FINANCE_QUEUE = "crm.finance.queue";
    public static final String INVENTORY_QUEUE = "crm.inventory.queue";

    @Bean
    public TopicExchange erpEventsExchange() {
        return new TopicExchange(ERP_EVENTS_EXCHANGE, true, false);
    }

    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE, true);
    }

    @Bean
    public Queue financeQueue() {
        return new Queue(FINANCE_QUEUE, true);
    }

    @Bean
    public Queue inventoryQueue() {
        return new Queue(INVENTORY_QUEUE, true);
    }

    @Bean
    public Binding notificationBinding(Queue notificationQueue, TopicExchange erpEventsExchange) {
        return BindingBuilder.bind(notificationQueue).to(erpEventsExchange).with("#");
    }

    @Bean
    public Binding financeInvoiceBinding(Queue financeQueue, TopicExchange erpEventsExchange) {
        return BindingBuilder.bind(financeQueue).to(erpEventsExchange).with(CrmRoutingKeys.INVOICE_CREATED);
    }

    @Bean
    public Binding financePaymentBinding(Queue financeQueue, TopicExchange erpEventsExchange) {
        return BindingBuilder.bind(financeQueue).to(erpEventsExchange).with(CrmRoutingKeys.PAYMENT_RECEIVED);
    }

    @Bean
    public Binding inventoryOrderBinding(Queue inventoryQueue, TopicExchange erpEventsExchange) {
        return BindingBuilder.bind(inventoryQueue).to(erpEventsExchange).with(CrmRoutingKeys.SALES_ORDER_CONFIRMED);
    }

    @Bean
    public MessageConverter jacksonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
