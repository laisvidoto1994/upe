package servico;

import java.io.BufferedReader;
import java.io.FileReader;
import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;
import org.apache.activemq.ActiveMQConnectionFactory;

public class Produtor {

	public static void main(String[] args) {
		try {
			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://localhost:61616");
			Connection connection = (Connection) connectionFactory.createConnection();
			connection.start();
			Session session = ((javax.jms.Connection) connection).createSession(false, Session.AUTO_ACKNOWLEDGE);
			Destination destination = session.createQueue("SPORT");

			MessageProducer producer = session.createProducer(destination);
			producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
			/*
			 * leitura simples
			 */
			//TextMessage message = session.createTextMessage("Hello Poli");
			//producer.send(message);
			
			
			/*
			 * leitura arquivo
			 */
			BufferedReader br = new BufferedReader(new FileReader("C://Users//pos//Downloads/taxi.txt"));
			String line = null;

			while ((line = br.readLine()) != null) {
				TextMessage msg = session.createTextMessage(line);
				producer.send(msg);
			}
			System.out.println("Menssagem enviada!");
			connection.close();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
