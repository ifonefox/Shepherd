names = ["Emma", "Noah", "Olivia", "Liam", "Alex"]
$rand = Random.new
$url = "localhost"
class Heart
  attr_writer :countdown
  attr_reader :thread
  def initialize(name)
    @countdown = 0
    @name = name
    @mutex = Mutex.new()
  end
  def update()
    @mutex.synchronize do
      if @countdown == 0
        num = $rand.rand(55..65)
        command = "curl '#{$url}:3000/post?bpm=#{num}&user=#{@name}' 2> /dev/null"
        puts(command)
        a = `#{command}`
      else
        @countdown = @countdown - 1
        command = "curl '#{$url}:3000/post?bpm=90&user=#{@name}' 2> /dev/null"
        puts(command)
        a = `#{command}`
      end
    end
  end
  def start()
    @thread = Thread.new do
      while true
        self.update()
        sleep 5
      end
    end
  end
  def err()
    @mutex.synchronize do
      @countdown = 5
    end
  end
end
hearts = []
for i in names 
  hearts.push(Heart.new(i))
end
for heart in hearts
  heart.start()
end
Thread.new{
  while true
    hearts[$rand.rand(0..hearts.length)].err()
    sleep 60
  end
}
for heart in hearts
  heart.thread.join()
end
