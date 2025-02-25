
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/utils/format";

const mockTransactions = [
  { id: 1, buyer: "Alex", seller: "Maria", nft: "Cyber Punk #123", price: 450 },
  { id: 2, buyer: "John", seller: "Sarah", nft: "Doodle #456", price: 890 },
  { id: 3, buyer: "Emma", seller: "Mike", nft: "Art Block #789", price: 670 },
  { id: 4, buyer: "David", seller: "Lisa", nft: "Cool Cat #321", price: 340 },
];

export const TransactionTicker = () => {
  const [transactions, setTransactions] = useState(mockTransactions);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction = {
        id: Date.now(),
        buyer: mockTransactions[Math.floor(Math.random() * mockTransactions.length)].buyer,
        seller: mockTransactions[Math.floor(Math.random() * mockTransactions.length)].seller,
        nft: mockTransactions[Math.floor(Math.random() * mockTransactions.length)].nft,
        price: Math.floor(Math.random() * 1000) + 100,
      };

      setTransactions(prev => [newTransaction, ...prev].slice(0, 4));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-background/80 backdrop-blur-sm border-b border-border sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="py-2 overflow-hidden">
          <div className="flex items-center gap-4">
            <AnimatePresence mode="popLayout">
              {transactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-shrink-0 text-sm"
                >
                  <span className="text-primary">{transaction.buyer}</span>
                  <span className="text-muted-foreground"> bought </span>
                  <span className="font-medium">{transaction.nft}</span>
                  <span className="text-muted-foreground"> from </span>
                  <span className="text-primary">{transaction.seller}</span>
                  <span className="text-muted-foreground"> for </span>
                  <span className="font-medium">{formatPrice(transaction.price)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
