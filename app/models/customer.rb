class Customer < ActiveRecord::Base
  def age
    return nil if self.birth.blank?

    d1=self.birth.strftime("%Y%m%d").to_i
    d2=Time.now.strftime("%Y%m%d").to_i
    return (d2 - d1) / 10000
  end
end
