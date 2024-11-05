import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-4">
          Готовы начать путешествие?
        </h2>
        <p className="text-lg mb-8">
          Присоединяйтесь к тысячам довольных клиентов, которые доверяют RentCar
        </p>
        <a href="/sign-up">
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            Начать сейчас
          </Button>
        </a>
      </div>
    </section>
  );
};